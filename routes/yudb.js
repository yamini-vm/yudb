const express = require('express');

const yudbController = require('../controllers/yudb');

const router = express.Router();

router.get('/', yudbController.getIndex);

router.get('/debug', yudbController.getDebug);

module.exports = router;