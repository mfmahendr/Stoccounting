const User = require ('../model/user')
const Pembelian = require ('../model/pembelian.js')

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

exports.findPembelian = async (req, res, next) => {
  try{
    if (req.params.id){
      const id = req.params.id;

      Pembelian.findById(id)
          .then(data => {
              if(!data){
                  res.status(404).send({message: "Tidak ditemukan transaksi pembelian dengan id " + id})
              }
              else {
                  res.status(200).json(data);
              }
          })
          .catch(err => {
              res.status(500).send({message: "Error mendapatkan data dengan id "+id})
          })
    } else {
      Pembelian.find()
          .then(data => {
              res.send(data)
          })
          .catch(err => {
              res.status(500).send({ message: err.message || "Error untuk mendapatkan informasi!"})
          })
    }
  } catch (err) {
      next(err)
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
      const removedPembelian = await Pembelian.deleteOne({ _id : req.params.id })
      res.status(200).json(removedPembelian)
    } catch(err) {
      next(err)
    }
}


