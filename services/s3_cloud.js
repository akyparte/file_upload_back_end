const fs = require('fs');
const S3 = require('aws-sdk');
const s3Instance = new S3.S3();

s3Instance.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION
})

async function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${process.env.DIRECTORY}/${file.filename}`,
        Body: fileStream,
    };
    try {
        return await s3Instance.upload(params).promise();
    }
    catch (e) {
        console.log(e);
    }

}

async function deleteFile(name) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: String(name),
    };
    let deleteResult = await s3Instance.deleteObject(params).promise();

    return deleteResult
}


module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;
