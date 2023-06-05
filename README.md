# Stoccounting
Aplikasi ini merupakan aplikasi sistem manajemen keuangan stok barang dagang dan digunakan untuk melakukan pemantauan keuangan terkait pembelian dan penjualan stok barang (akuntansi perusahaan dagang). Aplikasi ini akan memantau arus kas dan keuangan bisnis terkait dengan pembelian dan penjualan stok barang. Setelah itu, aplikasi ini dapat menghasilkan laporan keuangan (seperti laporan neraca, laporan rugi-laba, dan laporan arus kas) serta visualisasi  yang dapat membantu bisnis dalam memantau kesehatan keuangan dan pengelolaan stok barang.


<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div align="center">

# Stoccounting

this is backend side of Stoccounting API

An Inventory Financial System Web App, created for Integrasi Aplikasi dan Informasi class <br/>
check more about frontend side [here][frontend-side]

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

[Author](#author-[kelompok-21]) •
[Output Structure](#output-structure) •
[Prerequisites](#prerequisites) •
[Getting Started](#getting-started) •
[Support File](#support-file)

</div>

## Author (Kelompok 21)
- Marsellius (20/456372/TK/50502)
- Muhammad Zikriansyah (20/456373/TK/50503)
- M. Fadhil Mahendra (20/460550/TK/51139)

## Output Structure

```shell
backend-kelompok4/
├── controller/
|   ├── pelaporan.js
|   ├── pembelian.js
|   ├── penjualan.js
|   ├── auth.js
|   └── user.js
├── models/
|   ├── pembelian.js
|   ├── penjualan.js
|   └── user.js
├── routes/
|   ├── pembelian.js
|   ├── penjualan.js
|   ├── pelaporan.js
|   ├── index.js
|   ├── auth.js
|   └── user.js
├── .gitignore
├── README.MD
├── index.js
├── package.json
├── package-lock.json
└── ...
```

## Dependencies
``` shell
"axios": "^1.4.0",
"body-parser": "^1.20.2",
"cors": "^2.8.5",
"dotenv": "^16.0.3",
"ejs": "^3.1.9",
"express": "^4.18.2",
"moment": "^2.29.4",
"mongoose": "^7.2.1",
"nodemon": "^2.0.22",
"path": "^0.12.7",
"pdfkit": "^0.13.0"
```

## Prerequisites
[Download][node-js] and install Node.js version 18.16 or higher.

## Getting Started
Setting up project for local usage.
1. Clone or Download this repository
    ```shell
    https://github.com/mfmahendr/Stoccounting.git
    ```
    if using SSS
    ```shell
    git@github.com:mfmahendr/Stoccounting.git
    ```
2. Install NPM packages
    ```shell
    npm install
    ```
3. Make config.env file in root folder<br/>
    ```shell
    MONGO_URI: "mongodb+srv://iai-kelompok6:stockmasterkel6@cluster0.kdsxc.mongodb.net/?retryWrites=true&w=majority"
    ORIGIN_FE: "URL asal (origin) yang diizinkan untuk mengakses aplikasi server Anda".
    HOST (opsional): "Host yang akan digunakan oleh server". Jika tidak disetel, server akan menggunakan nilai default 'localhost'.
    SERVER_PORT (opsional): "Port yang akan digunakan oleh server". Jika tidak disetel, server akan menggunakan nilai default '3000'.
    ```
4. Run the program
    ```shell
    npm start
    ```

## Support File
- [Slide Presentasi][ppt-file]
- [Video Presentasi][video-file]


[frontend-side]: https://github.com/mfmahendr/StockMaster
[node-js]: https://nodejs.org/en/download/
[ppt-file]: https://docs.google.com/presentation/d/1_nEyocnZT2uDtAeu01zvwC0Ddd0HS_PSYQrayRLFBdM/edit#slide=id.g24e91326fc2_1_7
[video-file]: https://ugm365-my.sharepoint.com/personal/mfmahendr_365_ugm_ac_id/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmfmahendr%5F365%5Fugm%5Fac%5Fid%2FDocuments%2FDocuments%2F2%5FKuliah%2FSemester%5F6%2FIntegrasi%20Aplikasi%20dan%20Informasi%2FStoccounting%2Emp4&ga=1
