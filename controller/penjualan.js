const User = require ('../model/user')
const Penjualan = require ('../model/penjualan')

// exports.find = async (req, res, next){}

exports.createPenjualan = async (req, res, next) => {
    try {
      const { tgl_jual, keterangan, jml_jual } = req.body;
  
      // Membuat objek Penjualan baru
      const newPenjualan = new Penjualan({
        tgl_jual,
        keterangan,
        jml_jual,
      });
  
      // Menyimpan objek Penjualan ke database
      const createdPenjualan = await newPenjualan.save();
  
      res.status(201).json(createdPenjualan);
    } catch (err) {
      next(err);
    }
  }

exports.editPenjualan = async (req, res, next) => {
    try {
      const updatedPost = await Penjualan.updateOne (
        { _id : req.params.id },
        { $set: req.body }
      )
      res.status(200).json(updatedPost)
    } catch(err) {
      next(err)
    }
}

exports.deletePenjualan = async (req, res, next) => { 
    try {
      const removedPenjualan = await Penjualan.deleteOne({ _id : req.params.id })
      res.status(200).json(removedPenjualan)
    } catch(err) {
      next(err)
    }
}

exports.findPenjualan = async (req, res, next) => {
    try {
        
        if (req.params.id){
            const _id = req.params.id;

            Penjualan.findById(_id)
                .then(data => {
                    if(!data){
                        res.status(404).send({message: "Tidak ditemukan transaksi dengan id " + _id})
                    }
                    else {
                        res.status(200).json(data);
                    }
                })
                .catch(err => {
                    res.status(500).send({message: "Error mendapatkan data dengan id "+id})
                })
        } else {
            Penjualan.find()
                .then(data => {
                    res.send(data)
                })
                .catch(err => {
                    res.status(500).send({ message: err.message || "Error untuk mendapatkan informasi!"})
                })
        }
    }
    catch{
      next(err)
    }
}

