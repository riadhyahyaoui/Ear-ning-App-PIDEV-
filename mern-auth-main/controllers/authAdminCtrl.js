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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'earning.music@gmail.com',
        pass: 'Music@Earning2022'
    }
});

const authAdminCtrl = {
    addAdmin: async (req, res, next) => {

        const { nom, prenom, ville, adresse, numero, email, password } = req.value.body;
        // check if user already exists
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

        // create new user 
        const newUser = new Users({

            fullname,
            username: newUserName,
            email,
            password: passwordHash,
            gender,
            role: 'admin',
            method: 'local',
            mobile,
            gender,
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
                  <h3>Welcome to Ear-ning Music App <a href="http://localhost:8080/api/auth/login">click here</a> to log in and use these</h3>
                  <h4>email :${email}</h4>
                  <h4>password :${req.value.body.password}</h4>
                  <hr />
                  <p>This email may containe sensetive information</p>
                  
              `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).json({ success: true });
    },

    allAdmins: async (req, res, next) => {
        AdminsList = await Users.find({ "role": "admin" });
        res.status(200).json({ success: true, AdminsList });

    },

    allUsers: async (req, res, next) => {
        UsersList = await Users.find({ "role": "user" });
        res.status(200).json({ success: true, UsersList });
    },
    getAll: async (req, res) => {
        await User.find()
            .then(data => {
                res.send({ users: data });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    },


    makeUser: async (req, res, next) => {
        foundUser = await Users.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "role": "user"
        }, { new: true }
        );
        res.status(200).json({ msg: "account has been changed to Simple User" });

    },
    makeAdmin: async (req, res, next) => {
        foundUser = await Users.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "role": "admin"
        }, { new: true }
        );
        res.status(200).json({ msg: "Sipmle User has been changed to admin" });

    },
    banUser: async (req, res, next) => {
        foundUser = await Users.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "banned": true 
        }, { new: true }
        );
        const emailData = {
            from: "earning.music@gmail.com",
            to: req.body.email,
            subject: 'Account banned',
            html: `
                  <h3>Your account has been banned , therefore you won't be able to login or use the application</h3>
                  <h4>Contact earning.music@gmail.com for futhur information </h4>

                  <hr />
                  <p>This email may containe sensetive information</p>
                  
              `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).json({ msg: "Your account has been banned" });

    }
    ,
    unbanUser: async (req, res, next) => {
        foundUser = await Users.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "banned": false
        }, { new: true }
        );
        res.status(200).json({ msg: "Your account has been unbanned" });

    }
}
module.exports = authAdminCtrl;
