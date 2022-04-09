const { auth, notReqAuthentication } = require('../middleware/auth');
const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const passport = require("passport"); require('../passport.js');


router.put("/activate/:secretToken", authCtrl.activate);
router.post('/forget', notReqAuthentication, authCtrl.forget);
router.post('/reset/:Passwordtoken', notReqAuthentication, authCtrl.resetPassword);
router.post("/refresh_token", authCtrl.generateAccessToken);
router.post("/register", authCtrl.register);
router.post("/login", notReqAuthentication, authCtrl.login);
router.post("/logout", authCtrl.logout);
router.get("/check", authCtrl.check);





module.exports = router;
