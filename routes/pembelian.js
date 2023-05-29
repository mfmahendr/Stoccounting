const express = require('express');
const router = express.Router();

const {
    newPembelian,
    editPembelian,
    deletePembelian
} = require('../controller/pembelian')

router.route('/')
  .get(findPembelian)
  .post(newPembelian);

router
  .route('/:id')
  .patch(editPembelian)
  .delete(deletePembelian)

module.exports = router;