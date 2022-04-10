

const router = require("express").Router();
const reclamationCtrl = require("../../controllers/reclamation/reclamationCtrl");

router.post('/add/:idUserSource',reclamationCtrl.addReclamation);
router.post('/consultReclamation/:id',reclamationCtrl.consultReclamation);
router.post('/OnlyDone/:id',reclamationCtrl.OnlyDone);



module.exports = router;
