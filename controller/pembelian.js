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
    if (req.query.id){
      const id = req.query.id;

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
      Penjualan.find()
          .then(data => {
              res.send(data)
          })
          .catch(err => {
              res.status(500).send({ message: err.message || "Error untuk mendapatkan informasi!"})
          })
  }
    
    const date = req.query.date || "everytime";
    
    const sortby = ['tgl_beli', '']
    sortby[1] = req.query.sortby || "jam_beli";
    const mode = req.query.mode || "asc";

    // Date
    if (date === "everytime"){
      var query = {}
    } else {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');

      var query = {
        tgl_beli: {
          $gte: startDate,
          $lte: endDate
          },
        }
      }
  
      // Get act
      const pembelian = await Pembelian.find(query);
    
      // Sorting
      for (var item in sortby){
  
          function sortBy(a, b){
            if(typeof a[sortby[item]] === 'string'){
              return a[sortby[item]].localeCompare(b[sortby[item]])
            } else {
              return a[sortby[item]] - b[sortby[item]]
            }
          }
      
          if (mode === "desc"){
            pembelian.sort(sortBy).reverse()
          } else {
            pembelian.sort(sortBy)
          }
      }
      
      const response = {
        data: {
          pembelian
        }
      };
  
      res.status(200).json(response);
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
      const removedPembelian = await Pembelian.remove({ _id : req.params.id })
      res.status(200).json(removedPembelian)
    } catch(err) {
      next(err)
    }
}


