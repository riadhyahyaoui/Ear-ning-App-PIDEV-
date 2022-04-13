

const router = require("express").Router();
const musicCtrl = require("../../controllers/music/musicCtrl");

router.post('/UploadMusic',musicCtrl.UploadMusic);
router.get('/:trackID',musicCtrl.DownloadMusic);
router.get('/fetechMusic/:trackName',musicCtrl.fetechMusicByName);
router.put('/dislikeMusic/:userId/:musicId',musicCtrl.dislikeMusic);
router.put('/likeMusic/:userId/:musicId',musicCtrl.likeMusic);

module.exports = router;
