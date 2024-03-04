const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const mime = require('mime-types');


const connectionString = 'DefaultEndpointsProtocol=https;AccountName=buildvercel;AccountKey=Rs17/Oknn0hbf8R4+AmSknLqRBoC91bBnyNDxj6R7ZnkB2bwX7w5CxMib50mMAibbtnFtl6ATb2n+ASt/tHHlw==;EndpointSuffix=core.windows.net'; // Replace with your Azure Blob Storage connection string
const containerName = 'app-builds'; // Replace with your Azure Blob Storage container name
// const PROJECT_ID ='sahil';
const PROJECT_ID = process.env.PROJECT_ID

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);



async function init() {
    console.log('Executing script.js');
    // publishLog('Build Started...');

    const outDirPath = path.join(__dirname, 'output');
    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        // publishLog(data.toString());
    });

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString());
        // publishLog(`error: ${data.toString()}`);
    });

    p.on('close', async function () {
        console.log('Build Complete');
        // publishLog(`Build Complete`);

        const distFolderPath = path.join(__dirname, 'output', 'build');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        // publishLog(`Starting to upload`);

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath);
            // publishLog(`uploading ${file}`);

            const blobClient = containerClient.getBlockBlobClient(`__outputs/${PROJECT_ID}/${file}`);
            const contentType = mime.lookup(filePath) || 'application/octet-stream';

            await blobClient.uploadFile(filePath, {
                blobHTTPHeaders: {
                    blobContentType: contentType
                }
            });

            // publishLog(`uploaded ${file}`);
            console.log('uploaded', filePath);
        }

        // publishLog(`Done`);
        console.log('Done...');
    });
}

init();
