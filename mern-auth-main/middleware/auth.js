const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');



const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      console.log(token)
      return res.status(400).json({ msg: "You are not authorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(400).json({ msg: "You are not authorized" });
    }

    const user = await Users.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}




//

const notReqAuthentication = (req, res, next) => {
  // VERIFYING USER
  // const token = req.cookies.refreshtoken;
  const token = req.cookies.access_token;

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

}

module.exports = { auth, notReqAuthentication };

