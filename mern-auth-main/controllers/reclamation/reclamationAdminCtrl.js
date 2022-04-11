const reclamation = require("../../models/reclamation");
const mongoose = require("mongoose");
const User = require("../../models/userModel");
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
const reclamationAdminCtrl = {


    doneReclamation: async (req, res) => {
        try {
            const updatedreclamation = await reclamation.findByIdAndUpdate(
                req.params.id,
                {$set:  { isDone: true }},{ new: true }
              );
              reclamation.findOne({ _id:req.params.id }).find(null, function (err, res) {
                if (err) { throw err; }
                console.log("res")
                console.log(res[0].idUserSource)

                User.findById(res[0].idUserSource).find(null, function (err, res2) {
                    if (err) { throw err; }
                        console.log("res2 : -----------------------------------------")
                        console.log(res2 )

                      const emailData = {
                        from: "earning.music@gmail.com",
                        subject: 'Complaint ',
                        to: res2[0].email,
                        html: `
                                        <h1>Hi  ${res2[0].fullname} ,</h1>
                                        <p>Your reclmation  about this subject : ${res[0].content}has been considered !</p>
                                        <hr />
                                        <p>have a good day !</p>
                                        
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
                      console.log('Email of admin : ' + res2[0].email);
                      console.log('------------------------------');
                  });
                
              });
              res.status(200).json(updatedreclamation);
              

        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllReclamation: async (req, res) => {
        await reclamation.find()
            .then(data => {
                res.send({ reclamations: data });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving reclamations."
                });
            });
    },
    // doneReclamation: async (req, res) => {

    //     //const reclamation = await reclamation.findByIdAndUpdate(req.params.id, { $set: { isDone: true } }, { new: true });


    //     const user = await User.findById(req.params.id)
    //     if (!user) {
    //         res.status(400).json({ msg: "User does not exist." });
    //     }


    //  }

};

module.exports = reclamationAdminCtrl;
