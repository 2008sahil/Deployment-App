const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const mime = require('mime-types');
const Redis = require('ioredis')



const containerName = 'app-builds'; // Replace with your Azure Blob Storage container name

const PROJECT_ID = process.env.PROJECT_ID
const DeploymentId = process.env.DeploymentId
const REDIS_URL = process.env.REDIS_URL;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_BLOB_CONTAINER = process.env.AZURE_BLOB_CONTAINER;


if (!REDIS_URL || !AZURE_STORAGE_CONNECTION_STRING || !AZURE_BLOB_CONTAINER || !PROJECT_ID || !DEPLOYMENT_ID) {
    console.error("Missing environment variables. Check your .env file.");
    process.exit(1);
}
const publisher = new Redis(REDIS_URL)

function publishLog(log) {
    publisher.publish(`logs:${DeploymentId}`, JSON.stringify({ log }))
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_BLOB_CONTAINER);



async function init() {
    console.log('Executing script.js');
    publishLog('Build Started...');

    const outDirPath = path.join(__dirname, 'output');
    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString());
        publishLog(`error: ${data.toString()}`);
    });

    p.on('close', async function () {
        console.log('Build Complete');
        publishLog(`Build Complete`);

        const distFolderPath = path.join(__dirname, 'output', 'build');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        publishLog(`Starting to upload`);

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath);
            publishLog(`uploading ${file}`);

            const blobClient = containerClient.getBlockBlobClient(`__outputs/${PROJECT_ID}/${file}`);
            const contentType = mime.lookup(filePath) || 'application/octet-stream';

            await blobClient.uploadFile(filePath, {
                blobHTTPHeaders: {
                    blobContentType: contentType
                }
            });

            publishLog(`uploaded ${file}`);
            console.log('uploaded', filePath);
        }

        publishLog(`Done`);
        console.log(' new file Done...');
        process.exit(0)
    });
}

init();
