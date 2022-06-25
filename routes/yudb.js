const express = require('express');

const yudbController = require('../controllers/yudb');

const router = express.Router();

router.get('/', yudbController.getIndex);

router.post('/debug', yudbController.postDebug);

router.get('/debug', yudbController.getDebug);

router.post('/next-debug', yudbController.postNextDebug);

router.post('/reset-debug', yudbController.postResetDebug);

module.exports = router;