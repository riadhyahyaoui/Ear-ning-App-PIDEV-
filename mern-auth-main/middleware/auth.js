const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');



const auth = async (req,res,next) => {
    try {
        const token = req.header("Authorization");

        if(!token){
          console.log(token)
            return res.status(400).json({ msg: "You are not authorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
          return res.status(400).json({ msg: "You are not authorized" });
        }

        const user = await Users.findOne({_id: decoded.id});

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}




// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.status(200).json({
          message: "you must log in *"
        });
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        req.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.status(200).json({
      message: "you must log in *"
    });
  }
};
const isLoggedIn = (req, res, next) => {
  console.log(req);
  if (req.user) {
    next();
  } else {
      res.status(401).send('Not Logged In');
    }
  }

const notReqAuthentication = (req, res, next) => {
  // VERIFYING USER
  const token = req.cookies.refreshtoken;
  // IF THERE IS A TOKEN NAME WITH JWT THEN IT IT WON'T LET USER GO SOME ROUTE
  if (token) {
    console.log(token);
    console.log("There is a token ");
    res.status(200).json({
      message: "you must log out *"
    });
    

  } else {
    // IF THERE IS NO TOKEN THEN USER ALLOW TO VISIT CERTAIN ROUTE
    console.log("There is no token ");
    next();
  }
 
    module.exports = isLoggedIn
}

module.exports = { auth, isLoggedIn,checkUser, notReqAuthentication };

