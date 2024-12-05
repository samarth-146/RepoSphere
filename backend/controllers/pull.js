const fs=require('fs').promises;
const path=require('path');
const {S3,S3_BUCKET}=require('../config/aws-config');

async function Pull() {
    const repoPath=path.resolve(process.cwd(),'.Sphere');
    const commitPath=path.join(repoPath,'commits');
    try{
        const params={
            Bucket:S3_BUCKET,
            Prefix:'commits/'
        }
        const data=await S3.listObjectsV2(params).promise();
        const contents=data.Contents
        for(const content of contents){
            const key=content.Key;
            const dirName=path.dirname(key).split('/').pop();
            const dirPath=path.join(commitPath,dirName);
            await fs.mkdir(dirPath,{recursive:true});
            const fileParams={
                Bucket:S3_BUCKET,
                Key:key
            };
            const fileData=await S3.getObject(fileParams).promise();
            await fs.writeFile(path.join(repoPath,key),fileData.Body);
        }
        console.log("Successfully pulled");

    }catch(e){
        console.error(`Unable to pull ${e}`);
    }
}

module.exports=Pull;