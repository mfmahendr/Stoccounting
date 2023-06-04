const moment = require('moment');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { set } = require('mongoose');

const SERVER_HOST = process.env.NODE_ENV === 'production' ? '' : 'localhost';
const PORT = process.env.SERVER_PORT || 3000;

const createJurnalHeader = (doc, jenis_jurnal, per_bulan, per_tahun) => { 
    doc
        .fontSize(20)
        .text(`Jurnal ${jenis_jurnal}`, 50, 50)
        .fontSize(12)
        .text(`Periode ${per_bulan}/${per_tahun}`, 50, 80)
        .fontSize(12)
        .text(`Tanggal Cetak: ${moment().format('DD/MM/YYYY')}`, 50, 100)
        .fontSize(12)
        .text(`Waktu Cetak: ${moment().format('HH:mm:ss')}`, 50, 120)
}

const createJurnalTable = (doc, jenis_jurnal, per_bulan, per_tahun, data_jurnal) => {
    let tableTop = 150;
    let tableLeft = 50;
    let tableRight = 550;
    let tableBottom = 650;
    let tableWidth = tableRight - tableLeft;
    let tableHeight = tableBottom - tableTop;
    let columnCount = 4;
    let columnSpacing = 15;
    let rowSpacing = 5;
    let usableWidth = tableWidth - columnSpacing * (columnCount - 1);
    let columnContainerWidth = usableWidth / columnCount;
    let columnWidth = columnContainerWidth - columnSpacing;
    let maxY = tableBottom;
    let rowBottomY = 0;

    doc
        .fontSize(12)
        .text(`No`, tableLeft, tableTop)
        .text(`Tanggal`, tableLeft + columnContainerWidth, tableTop)
        .text(`Keterangan`, tableLeft + 2 * columnContainerWidth, tableTop)
        .text(`Nominal`, tableLeft + 3 * columnContainerWidth, tableTop)

    doc
        .moveTo(tableLeft, tableTop + 20)
        .lineTo(tableRight, tableTop + 20)
        .stroke()

    let i = 1;
    let j = 0;
    let total = 0;

    data_jurnal.forEach((item) => {
        const tgl = item.tgl_jual || item.tgl_beli;
        const date = new Date(tgl);

        const tgl_transaksi = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        doc
            .fontSize(12)
            .text(`${i}`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
            .text(`${tgl_transaksi}`, tableLeft + columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1))
            .text(`${item.keterangan}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1))
            .text(`${item.jml_jual || item.jml_beli}`, tableLeft + 3 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1))

        total += item.jml_jual || item.jml_beli;
        i++;
    })

    doc
        .moveTo(tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .lineTo(tableRight, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .stroke()

    doc
        .fontSize(12)
        .text(`Total`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)
        .text(`${total}`, tableLeft + 3 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)


    doc
        .moveTo(tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 20)
        .lineTo(tableRight, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 20)
        .stroke()

    doc
        .fontSize(12)
        .text(`Mengetahui,`, tableLeft + 3 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 50, { align: 'center' })
        .text(`Pemilik`, tableLeft + 3 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 70, { align: 'center' })
        .text(`(____________________)`, tableLeft + 3 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 100, { align: 'center' })

    doc
        .fontSize(12)
        .text(`Dibuat Oleh,`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 50, { align: 'center' })
        .text(`Kasir`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 70, { align: 'center' })
        .text(`(____________________)`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 100, { align: 'center' })

}

const createJurnal = (jenis_jurnal, per_bulan, per_tahun, data_jurnal) => {
    let doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(`jurnal_${jenis_jurnal}_${per_bulan}_${per_tahun}.pdf`));

    createJurnalHeader(doc, jenis_jurnal, per_bulan, per_tahun);
    createJurnalTable(doc, jenis_jurnal, per_bulan, per_tahun, data_jurnal);

    doc.end();

    return true;
  }
  
  exports.generateJurnal = async (req, res, next) => {
    try {
      const { jenis_jurnal, per_bulan, per_tahun } = req.body;
      const filePath = path.join(process.cwd(), `jurnal_${jenis_jurnal}_${per_bulan}_${per_tahun}.pdf`);
  
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
          const penjualan = await axios.get(`http://${SERVER_HOST}:${PORT}/api/penjualan`);
          data_jurnal = penjualan.data;
          console.log("Data Penjualan:", data_jurnal);
        
          data_jurnal = data_jurnal.filter((item) => {
            let date = new Date(item.tgl_jual);
            
            console.log(`${date.getMonth() + 1} = ${per_bulan} && ${date.getFullYear()} == ${per_tahun}`);
            return date.getMonth() + 1 == per_bulan && date.getFullYear() == per_tahun
          });
        
          console.log("Data Penjualan Difilter:", data_jurnal);
        } else if (jenis_jurnal === "pembelian"){
          const pembelian = await axios.get(`http://${SERVER_HOST}:${PORT}/api/pembelian`);
          data_jurnal = pembelian.data;
          console.log("Data Pembelian:", data_jurnal);
        
          data_jurnal = data_jurnal.filter((item) => {
            const date = new Date(item.tgl_beli);
            
            console.log(`${date.getMonth() + 1} = ${per_bulan} && ${date.getFullYear()} == ${per_tahun}`);
            return date.getMonth() + 1 == per_bulan && date.getFullYear() == per_tahun
          });


          console.log("Data Pembelian Difilter:", data_jurnal);
        }
       } else {
            return res.status(400).json({
                message: "Jenis jurnal harus diisi!"
            })
      }
      
      const result = createJurnal(jenis_jurnal, per_bulan, per_tahun, data_jurnal);
      if (result){
        await new Promise((resolve)=>setTimeout(resolve,2000));

        res.status(201).sendFile(filePath, {
            headers: {
              'Content-Type': 'application/pdf',
            },
          });
      
      }
    } catch (err) {
      next(err);
    }
}

// Laporan Laba Rugi
const createLabaRugiHeader = (doc, per_bulan, per_tahun) => {
    doc
        .fontSize(12)
        .text(`Laporan Laba Rugi`, 50, 50)
        .text(`Periode ${per_bulan}/${per_tahun}`, 50, 70)
}

const createLabaRugiTable = (doc, data_jual, data_beli) => {

    const tableTop = 100;
    const tableLeft = 50;
    const tableRight = 550;
    const columnContainerWidth = 150;
    const rowSpacing = 10;

    doc
        .fontSize(12)
        .text(`Transaksi`, tableLeft, tableTop + 20)
        .text(`Nominal`, tableLeft + 2 * columnContainerWidth, tableTop + 20)

    doc
        .moveTo(tableLeft, tableTop + 30)
        .lineTo(tableRight, tableTop + 30)
        .stroke()

    let total_pendapatan = 0;
    let total_pengeluaran = 0;

    let i = 2;

        
    data_jual.forEach((item) => {
        const tgl_jual = new Date(item.tgl_jual).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        doc
            .fontSize(12)
            .text(`${tgl_jual}`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
            .text(`${item.jml_jual}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1))

        total_pendapatan += item.jml_jual;
        i++;
    })

    doc
        .moveTo(tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .lineTo(tableRight, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .stroke()

    doc
        .fontSize(12)
        .text(`Total Pendapatan`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)
        .text(`${total_pendapatan}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)

    i++;
     
    data_beli.forEach((item) => {
        const tgl_beli = new Date(item.tgl_beli).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        doc
            .fontSize(12)
            .text(`${tgl_beli}`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
            .text(`${item.jml_beli}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1))

        total_pengeluaran += item.jml_beli;
        i++;
    }
    )

    doc
        .moveTo(tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .lineTo(tableRight, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .stroke()

    doc
        .fontSize(12)
        .text(`Total Pengeluaran`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)
        .text(`${total_pengeluaran}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)

    i++;

    doc
        .moveTo(tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .lineTo(tableRight, tableTop + 20 + (rowSpacing + 20) * (i - 1))
        .stroke()

    doc
        .fontSize(12)
        .text(`Laba Rugi`, tableLeft, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)
        .text(`${total_pendapatan - total_pengeluaran}`, tableLeft + 2 * columnContainerWidth, tableTop + 20 + (rowSpacing + 20) * (i - 1) + 5)

}

const createLabaRugi = async (per_bulan, per_tahun, data_jual, data_beli) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(`laba_rugi_${per_bulan}_${per_tahun}.pdf`));

    createLabaRugiHeader(doc, per_bulan, per_tahun);
    createLabaRugiTable(doc, data_jual, data_beli);

    doc.end();

    return true
}

exports.generateLabaRugi = async (req, res, next) => {
    try {
      const { per_bulan, per_tahun } = req.body;
      const filePath = path.join(process.cwd(), `laba_rugi_${per_bulan}_${per_tahun}.pdf`);
  
      
      const penjualan = await axios.get(`http://${SERVER_HOST}:${PORT}/api/penjualan`);
      let data_jual = penjualan.data;
    
      data_jual = data_jual.filter((item) => {
        const date = new Date(item.tgl_jual);
        
        return date.getMonth() + 1 == per_bulan && date.getFullYear() == per_tahun
      });

      
      const pembelian = await axios.get(`http://${SERVER_HOST}:${PORT}/api/pembelian`);
      let data_beli = pembelian.data;
    
      data_beli = data_beli.filter((item) => {
        const date = new Date(item.tgl_beli);
        
        return date.getMonth() + 1 == per_bulan && date.getFullYear() == per_tahun
      });
        
  
      const result = await createLabaRugi(per_bulan, per_tahun, data_jual, data_beli);
      if(result) {
        await new Promise((resolve)=>setTimeout(resolve,2000));

        res.status(201).sendFile(filePath, {
          headers: {
            'Content-Type': 'application/pdf',
          },
        });
      }
    } catch (err) {
      next(err);
    }
}