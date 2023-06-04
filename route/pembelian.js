const express = require('express');
const router = express.Router();

const {
    createPembelian,
    editPembelian,
    deletePembelian,
    findPembelian
} = require('../controller/pembelian')

router.route('/')
  .get(findPembelian)
  .post(createPembelian);

router
  .route('/:id')
  .get(findPembelian)
  .patch(editPembelian)
  .delete(deletePembelian);

module.exports = router;