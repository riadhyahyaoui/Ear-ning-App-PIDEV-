const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");


router.put('/follow/:followId/:follwingid', userCtrl.follow);
router.put('/unfollow/:followId/:follwingid', userCtrl.unfollow);

router.delete("/deleteUser/:id",userCtrl.desactivate);


router.get("/getFollowers/:id", userCtrl.getFollowers);
router.get("/getFollowing/:id", userCtrl.getFollowing);

module.exports = router;
