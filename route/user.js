const express = require('express');
const router = express.Router();
const { editUser, deleteUser, getUsers } = require('../controller/user');

router
  .route('/')
  .get(getUsers)
  .delete(deleteUser)
  .patch(editUser)

module.exports = router;