let express = require('express');
let fileUploadRouter = express.Router();
const multer = require('multer');
const Queries = require('../db_files/db-functions')
const queries = new Queries();
const awsService = require('../services/s3_cloud');
const { storage } = require('../services/multer_startup');

const upload = multer({ storage: storage })
fileUploadRouter.post('/upload-file', upload.single('file'), async (req, res) => {
    try {
      if (req && req.file) {
        await queries.addFileEntry(req.file);
        res.send('dd')
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      res.sendStatus(501)
      console.log(error)
    }
  })
  
  
  fileUploadRouter.get('/get-files', async (req, res) => {
    try {
      let page = 1;
      let pageSize = 10;
      let sortBy = 'createdAt';
      let sortOrder = 'ASC';
  
      if(req.query.page){
        page = req.query.page;
      }
      if(req.query.pageSize){
        pageSize = req.query.pageSize
      }
      if(req.query.sortBy){
        sortBy = req.query.sortBy
      }
      if(req.query.sortOrder){
        sortOrder = req.query.sortOrder
      }
    
      console.log(req.query)
      let result = await queries.getFileEntries(page,pageSize,sortBy,sortOrder);
      res.json(result)
    } catch (error) {
      res.sendStatus(501)
      console.log(error)
    }
  })
  
  
  fileUploadRouter.post('/delete-file', async (req, res) => {
    try {
      if(req.body && req.body.fileId && req.body.filename ){
        let result = await queries.deleteFileWithEntry(req.body.fileId , req.body.filename);
        res.json(result)
        awsService.deleteFile(req.body.filename)
      }
    } catch (error) {
      res.sendStatus(501)
      console.log(error)
    }
  })
  
  
  fileUploadRouter.get('/download-file', async (req, res) => {
    try {
      if( req.query.filename ){
          res.download(__dirname + '/my_uploads/' + req.query.filename);
      }
    } catch (error) {
      res.sendStatus(501)
      console.log(error)
    }
  })
module.exports.fileUploadRouter = fileUploadRouter;