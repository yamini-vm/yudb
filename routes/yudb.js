const express = require('express');

const xdbController = require('../controllers/yudb');

const router = express.Router();

router.get('/', xdbController.getIndex);

module.exports = router;