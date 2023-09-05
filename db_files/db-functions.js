const { File } = require('./database');
const Sequelize = require('sequelize');
const awsService = require('../services/s3_cloud');
const fs = require('fs/promises')

class Queries {

    async addFileEntry(file) {


        let uploadResult = await awsService.uploadFile(file);

        let result = await File.create({
            originalname: file.originalname,
            modifiedname: uploadResult.Key,
            filetype:file.mimetype.split('/')[1],
            src:uploadResult.Location
        })

        await fs.unlink(file.path);

        return { data: result.dataValues, entryAdded: true }
    }

    async getFileEntries(page, pageSize, sortBy, sortOrder) {

        try {
            let offset = (page - 1) * pageSize;
            let sqlQuery = "SELECT SQL_CALC_FOUND_ROWS * FROM files as f "
                + " order by " + "f." + sortBy + " " + sortOrder + " limit " + offset + ", " + pageSize + ";";
    
            const data = await File.sequelize.query(sqlQuery,{type:Sequelize.QueryTypes.SELECT});
            const no_of_rows = await File.sequelize.query("SELECT FOUND_ROWS() as no_of_rows",{type:Sequelize.QueryTypes.SELECT});

            console.log(no_of_rows)
            return { "data": data, "total": no_of_rows[0]['no_of_rows'] };    
        } catch (error) {
            console.log(error)
        }
    }


    async deleteFileWithEntry(fileId,filename) {
        try {
            let result = await File.destroy({where:{id:fileId}});
            if(result === 1){
                return { fileDeleted : true };    
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Queries;