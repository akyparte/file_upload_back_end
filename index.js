require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {fileUploadRouter} = require('./routes/file-upload')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({ origin: '*' }));
app.use(express.static( __dirname +'/my_uploads'));

app.use('/files',fileUploadRouter);

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
});