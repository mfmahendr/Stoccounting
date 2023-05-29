const User = require ('../models/user')
const Pembelian = require ('../models/pembelian.js')

exports.createPembelian = async (req, res, next) => {
    try {
      const { tgl_beli, keterangan, jml_beli } = req.body;
  
      // Membuat objek Pembelian baru
      const newPembelian = new Pembelian({
        tgl_beli,
        keterangan,
        jml_beli,
      });
  
      // Menyimpan objek Pembelian ke database
      const createdPembelian = await newPembelian.save();
  
      res.status(201).json(createdPembelian);
    } catch (err) {
      next(err);
    }
  }

exports.editPembelian = async (req, res, next) => {
    try {
      const updatedPost = await Pembelian.updateOne (
        { _id : req.params.id },
        { $set: req.body }
      )
      res.status(200).json(updatedPost)
    } catch(err) {
      next(err)
    }
}

exports.deletePembelian = async (req, res, next) => { 
    try {
      const removedPembelian = await Pembelian.remove({ _id : req.params.id })
      res.status(200).json(removedPembelian)
    } catch(err) {
      next(err)
    }
}


