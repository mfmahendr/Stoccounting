const express = require('express');
const router = express.Router();

const {
    createPenjualan,
    findPenjualan,
    editPenjualan,
    deletePenjualan
} = require('../controller/penjualan')

router.route('/')
  .get(findPenjualan)
  .post(createPenjualan);

router
  .route('/:id')
  .get(findPenjualan)
  .patch(editPenjualan)
  .delete(deletePenjualan)

module.exports = router;