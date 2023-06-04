const express = require('express');
const router = express.Router();

const { generateJurnal, generateLabaRugi } = require('../controller/pelaporan');

router.post('/jurnal/generate', generateJurnal);
router.post('/laporan-laba-rugi/generate', generateLabaRugi);

module.exports = router;