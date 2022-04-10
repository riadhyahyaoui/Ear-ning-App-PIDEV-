

const router = require("express").Router();
const reclamationAdminCtrl = require("../../controllers/reclamation/reclamationAdminCtrl");

router.get('/getAllReclamation',reclamationAdminCtrl.getAllReclamation);
router.put('/doneReclamation/:id',reclamationAdminCtrl.doneReclamation);

module.exports = router;
