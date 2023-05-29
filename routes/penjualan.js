const express = require('express');
const router = express.Router();

const {
    newPenjualan,
    editPenjualan,
    deletePenjualan
} = require('../controller/penjualan')

router.route('/')
  .get(findPenjualan)
  .post(newPenjualan);

router
  .route('/:id')
  .patch(editPenjualan)
  .delete(deletePenjualan)

module.exports = router;