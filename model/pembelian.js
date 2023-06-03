const mongoose = require('mongoose')

const BeliSchema = mongoose.Schema({
  tgl_beli: {
    type: Date,
    required: true,
    unique: false,
  },
  keterangan:{
    type: String,
    required: true,
    unique: false,
  },
  jml_beli: {
    type: Number,
    required: true,
    unique: false,
  }
})

module.exports = mongoose.model('Pembelian', BeliSchema)