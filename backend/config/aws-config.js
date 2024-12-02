const AWS=require('aws-sdk');
require('dotenv').config();
console.log(process.env.SECRET_KEY)
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
});

const S3=new AWS.S3();
const S3_BUCKET="demosambucket";
module.exports={S3,S3_BUCKET};
