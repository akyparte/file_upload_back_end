const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
   'file',
   'root',
   'root',
   {
      host: 'localhost',
      dialect: 'mysql'
   }
);

(async function (params) {
   try {
      await sequelize.authenticate()
      console.log('Connection has been established successfully.');

   } catch (error) {
      console.error('Unable to connect to the database: ', error);
   }
})()


const File = sequelize.define("file", {
   originalname: DataTypes.TEXT,
   modifiedname: DataTypes.TEXT,
   filetype: DataTypes.TEXT,
   src:DataTypes.TEXT,
});

(async function () {
   try{
      await sequelize.sync();
      console.log('table created');
   }catch(err){
       console.log(err);
       console.log('error occured');
   }
})();
exports.File = File;


