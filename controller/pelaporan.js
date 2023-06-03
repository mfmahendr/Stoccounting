const moment = require('moment');
const axios = require('axios');

exports.createJurnal = async (req, res, next) => {
    try {
      const { jenis_jurnal, per_bulan, per_tahun } = req.body;
  
      let data_jurnal = [];

      if(jenis_jurnal){
        if (!per_bulan || !per_tahun){
          return res.status(400).json({
              message: "Salah satu periode transaksi harus diisi!"
          })
        } else if(per_bulan && !per_tahun){
            return res.status(400).json({
                message: "Periode tahun harus diisi jika ingin jurnal periode bulan tertentu!"
            })
        } else if (jenis_jurnal !== "penjualan" && jenis_jurnal !== "pembelian"){
            return res.status(400).json({
                message: "Jenis jurnal harus penjualan atau pembelian!"
            })
        } else if (jenis_jurnal === "penjualan"){
          const penjualan = await axios.get(`http://${process.env.SERVER_HOST}:${process.env.PORT}/api/penjualan`);
          let data_jual = penjualan.data;
        
          data_jurnal = data_jual.filter((item) => {
          const date = new Date(item.tgl_jual);
            
          return date.getMonth() === per_bulan && date.getFullYear() === per_tahun});
        
          console.log(data_jurnal);
        } else if (jenis_jurnal === "pembelian"){
          const pembelian = await axios.get(`http://${process.env.SERVER_HOST}:${process.env.PORT}/api/pembelian`);
          let data_beli = pembelian.data;
        
          data_jurnal = data_beli.filter((item) => {
            const date = new Date(item.tgl_beli);
            
            return date.getMonth() === per_bulan && date.getFullYear() === per_tahun});
        
            console.log(data_jurnal);
        }} else {
            return res.status(400).json({
                message: "Jenis jurnal harus diisi!"
            })
         }
      
      // Membuat objek Jurnal baru
      const newJurnal = {
        jenis_jurnal,
        per_bulan,
        per_tahun,
        data_jurnal: data_jurnal,
      };

      // Menyimpan objek Penjualan ke database
      const createdPenjualan = await newPenjualan.save();
  
      res.status(201).json(createdPenjualan);
    } catch (err) {
      next(err);
    }
  }