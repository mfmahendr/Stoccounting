const mongoose = require('mongoose')

const JualSchema = mongoose.Schema({
  tgl_jual: {
    type: Date,
    required: true,
    unique: false,
  },
  keterangan:{
    type: String,
    required: true,
    unique: false,
  },
  jml_jual: {
    type: Number,
    required: true,
    unique: false,
  }
})

module.exports = mongoose.model('Penjualan', JualSchema)