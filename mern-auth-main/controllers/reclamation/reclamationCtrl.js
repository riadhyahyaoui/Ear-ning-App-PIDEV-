const reclamation = require("../../models/reclamation");
const User = require("../../models/userModel");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'earning.music@gmail.com',
    pass: 'Music@Earning2022'
    //admin : EarningMusicAdmin 
    //earningmusicadd@gmail.com

  }
});

const reclamationCtrl = {
  addReclamation: async (req, res) => {
    try {

      const user = await User.findById(req.params.idUserSource);
      const newreclamation = new reclamation({
        idUserSource: req.params.idUserSource,
        content: req.body.content

      });

      await newreclamation.save();
      const emailData = {
        from: "earning.music@gmail.com",
        to: user.email,
        subject: 'Complaint About App ',
        html: `
                        <h1>Hi  ${user.fullname} ,</h1>
                        <p>Your Complaint has been Registered Successfully</p>
                        <hr />
                        <p>we will make a sign as soon as your copmlaint is processed</p>
                        
                    `
      };
      transporter.sendMail(emailData, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      User.find({ role: "admin" }).find(null, function (err, res) {
        if (err) { throw err; }
        for (var i = 0, l = res.length; i < l; i++) {

          const emailData = {
            from: "earning.music@gmail.com",
            subject: 'Complaint About App ',
            to: res[i].email,
            html: `
                            <h1>Hi  ${res[i].fullname} ,</h1>
                            <p>You Have a new Complaint Check it as soon as possible </p>
                            <hr />
                            <p>Thank you !</p>
                            
                        `
          };

          transporter.sendMail(emailData, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          console.log('------------------------------');
          console.log('Email of admin : ' + res[i].email);
          console.log('------------------------------');
        }
        console.log(res)
      });


      res.json({
        msg: "Complaint Successfully!",
        user: {
          ...User._doc,
        },
        reclamation: {
          ...newreclamation._doc,
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  consultReclamation: async (req, res) => {
    await reclamation.find({ idUserSource: req.params.id })
      .then(data => {
        res.send({ reclmations: data });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reclmation."
        });
      });
  },
  OnlyDone: async (req, res) => {
    await reclamation.find({ idUserSource: req.params.id, isDone: true })
      .then(data => {
        if (!reclamation) {
          res.status(400).json({ msg: "vos reclamtions n'ont pas prise en charge pour le moment ." });
        }
        res.send({ reclmations: data });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving reclmation."
        });
      });
    
  },
};

module.exports = reclamationCtrl;
