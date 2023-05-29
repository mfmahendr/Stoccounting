const express = require('express');
const router = express.Router();
const { editUser, deleteUser, getUsers } = require('../controllers/user');

router
  .route('/')
  .get(getUsers)
  .delete(deleteUser)
  .patch(editUser)

module.exports = router;