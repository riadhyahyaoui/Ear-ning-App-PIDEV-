const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fetch = require('node-fetch');
const url = require('url');
var randomstring = require("randomstring");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com");

const jwt_decode = require('jwt-decode');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"

  }
}))
const transporter2 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'earning.music@gmail.com',
    pass: 'Music@Earning2022'
  }
});

const authCtrl = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, mobile, address, gender } = req.body;
      let newUserName = username.toLowerCase().replace(/ /g, "");

      const user_name = await Users.findOne({ username: newUserName });
      if (user_name) {
        return res.status(400).json({ msg: "This username is already taken." });
      }

      const user_email = await Users.findOne({ email });
      if (user_email) {
        return res
          .status(400)
          .json({ msg: "This email is already registered." });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long." });
      }
      st = randomstring.generate();

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
        gender,
        role: 'user',
        method: 'local',
        mobile,
        address,
        Isactive: false,
        secretToken: st
      });
      await newUser.save();
      const emailData = {
        from: "earning.music@gmail.com",
        to: email,
        subject: 'New account created',
        html: `
                    <h1>Please use the following to activate your account</h1>
                    <p>http://localhost:8080/api/auth/activate/${st}</p>
                    <hr />
                    <p>This email may containe sensetive information</p>
                    
                `
      };


      transporter2.sendMail(emailData, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("jwt", refresh_token, {
        httpOnly: true,
        path: "/api/auth/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
      });

      res.json({
        msg: "Registered Successfully!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },



  login: async (req, res) => {
    try {

      const { email, password } = req.body;

      const user = await Users.findOne({ email, role: "user" });

      if (!user) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      if (user.Isactive == false) {
        return res.status(400).json({ msg: "You must verify you account." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Email or Password is incorrect 2." });
      }

      //const access_token = createAccessToken({ id: user._id });
      access_token = signToken(user);

      const refresh_token = createRefreshToken({ id: user._id });

      // res.cookie('refreshtoken', access_token, { httpOnly: true, maxAge:  30 * 24 * 60 * 60 * 1000 });
      res.cookie("access_token", access_token, {
        httpOnly: true,
        // path: "/api/refresh_token",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
      });

      res.json({
        msg: "Logged in  Successfully!",
        access_token,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },


  logout: async (req, res) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      return res.json({ msg: "Logged out Successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      console.log("im here !!! ")
      const rf_token = req.cookies.refreshtoken;
      console.log(rf_token);
      if (!rf_token) {
        return res.status(400).json({ msg: "Please login again." });
      }
      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            res.status(400).json({ msg: "Please login again." });
          }

          const user = await Users.findById(result.id)
            .select("-password");

          if (!user) {
            res.status(400).json({ msg: "User does not exist." });
          }

          const access_token = createAccessToken({ id: result.id });
          res.json({ access_token, user });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },


  activate: async (req, res) => {
    try {

      const user_token = await Users.findOneAndUpdate({ secretToken: req.params.secretToken }, { $set: { Isactive: true } }, { new: true });
      if (user_token) {
        return res
          .status(200)
          .json({ msg: "token verified !" });
      }
      else {
        return res
          .status(400)
          .json({ msg: "You must verify !" });
      }

    } catch (err) {
      res.status(500).json(err);
    }
  },
  forget: async (req, res, next) => {
    try {
      const email = req.body.email;
      const foundUser = await Users.findOne({ email });
      if (!foundUser) {
        return res
          .status(400)
          .json({ msg: "This email is already registered." });
      }

      st = randomstring.generate();
      await foundUser.updateOne({
        "Passwordtoken": st,
        "PasswordResetDate": Date.now() + 3600000
      }, { new: true }
      );




      const emailData = {
        from: "earning.music@gmail.com",
        to: email,
        subject: 'Account password change ',
        html: `
                        <h1>Please use the following to change your password</h1>
                        <p>http://localhost:8080/api/auth/reset/${st}</p>
                        <hr />
                          <p>This email may containe sensetive information</p>
                    
                `
      };


      transporter2.sendMail(emailData, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


      res.status(200).json({ foundUser });
    } catch (error) {
      next(error);

    }

  },

  resetPassword: async (req, res, next) => {
    try {

      const Passwordtoken = req.params.Passwordtoken;
      const foundUser = await Users.findOne({ Passwordtoken, "PasswordResetDate": { $gt: Date.now() } });
      console.log(Passwordtoken)
      console.log(foundUser)

      if (!foundUser) {
        return res.status(403).json({ error: 'Password reset token is invalid or has expired' });

      }
      if (req.body.newpassword != req.body.confirmnewpassword) {
        return res.status(403).json({ error: 'check the passwords that you have entered' });

      }

      const passwordHash = await bcrypt.hash(req.body.newpassword, 12);
      await foundUser.updateOne({
        "password": passwordHash,
        "Passwordtoken": undefined,
        "PasswordResetDate": undefined
      }, { new: true }
      );
      res.status(200).json({ foundUser });

    } catch (error) {
      next(error);

    }

  },
  check: async (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      if (token) {
        decodedToken = jwt_decode(token);

        if (decodedToken) {
          return res.status(200).json({
            msg: "User Checked!",
            "decoded token ": decodedToken,

          });
        }
        if (!decodedToken) {
          return res.status(400).json({ msg: "You are not authorized 1  (decoded)" });
        }

        return res.status(400).json({ msg: "You are not authorized (token )" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
/* update*/

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
const signToken = (user) => {
  return jwt.sign({ iss: 'Earning', sub: user.id, user: user }, 'EarningToken', { expiresIn: "1d" });
}



module.exports = authCtrl;
