const fs = require('fs').promises 
const path = require('path') 
const ipfsAPI = require('ipfs-api') 

const ipfs = ipfsAPI({ host: '127.0.0.1', port: 5001, protocol: 'http' }) 

async function makeFileObjects(ownerName, docName, validated, description, document, tokenId) {
    const obj = { ownerName, docName, validated, description, document } 
    const buffer = Buffer.from(JSON.stringify(obj)) 

    const files = [
        { path: `${tokenId}.json`, content: buffer }
    ] 
    return files 
}

async function storeFiles(files) {
    const result = await ipfs.files.add(files, { wrapWithDirectory: true }) 
    return result[0].hash 
}

const fileFromPath = async (document, fileName) => {
    const filePath = document.tempFilePath 
    const content = await fs.readFile(filePath) 
    const files = [
        { path: fileName, content }
    ] 
    return files 
} 


const ipfsUpload = async (req, res) => {
    const { ownerName, docName, validated, description, tokenId } = req.body 
    console.log(ownerName, docName, validated, description, tokenId) 

    const { document } = req?.files ?? {} 
    console.log(`Uploading document: [${docName}] to local IPFS server.`) 

    try {
        if (!document || !docName || !description || !ownerName || !validated || !tokenId || docName === undefined) {
            return res.status(400).send({ message: 'Invalid input' }) 
        }

        const documentName = `${new Date().getTime()}_${document.name.replace(/ /g, '')}` 
        const file = await fileFromPath(document, documentName) 
        const documentCid = await storeFiles(file) 

        const files = await makeFileObjects(
            ownerName,
            docName,
            validated,
            description,
            `http://localhost:8081/ipfs/${documentCid}`,
            tokenId
        ) 

        const metaDataCid = await storeFiles(files) 

        const metadataUrl = `http://localhost:8081/ipfs/${metaDataCid}` 

        const ipfsTierInfo = {
            ownerName,
            docName,
            validated,
            description,
            ipfsUrl_Metadata: metadataUrl,
            ipfsUrl_Document: `http://localhost:8081/ipfs/${documentCid}`
        } 

        res.json(ipfsTierInfo) 
    } catch (error) {
        console.log(`Problem while uploading document to local IPFS server: ${error}`) 
        return res.status(500).send({
            message: 'Problem while uploading document to local IPFS server'
        }) 
    }
}

const resumeUpload = async (req, res) => {
    const { document } = req?.files ?? {};
    console.log(`Uploading resume into local IPFS server.`);

    try {
        if (!document) {
            return res.status(400).send({ message: 'Invalid input' });
        }

        const resumeName = `${new Date().getTime()}_${document.name.replace(/ /g, '')}`;
        const file = await fileFromPath(document, resumeName);
        const resumeCid = await storeFiles(file);

        const resumeUrl = `http://localhost:8081/ipfs/${resumeCid}`;

        res.json({ resumeUrl });
    } catch (error) {
        console.log(`Problem while uploading resume to local IPFS server: ${error}`);
        return res.status(500).send({
            message: 'Problem while uploading resume to local IPFS server'
        });
    }
}

const ProjectFileUpload = async (req, res) => {
    const { document } = req?.files ?? {};
    console.log(`Uploading project file into local IPFS server.`);

    try {
        if (!document) {
            return res.status(400).send({ message: 'Invalid input' });
        }

        const projectFileName = `${new Date().getTime()}_${document.name.replace(/ /g, '')}`;
        const file = await fileFromPath(document, projectFileName);
        const projectFileCid = await storeFiles(file);

        const projectFileURL = `http://localhost:8081/ipfs/${projectFileCid}`;

        res.json({ projectFileURL });
    } catch (error) {
        console.log(`Problem while uploading project file to local IPFS server: ${error}`);
        return res.status(500).send({
            message: 'Problem while uploading project file to local IPFS server'
        });
    }
}

const AchievementFileUpload = async (req, res) => {
    const { document } = req?.files ?? {};
    console.log(`Uploading achievement file into local IPFS server.`);

    try {
        if (!document) {
            return res.status(400).send({ message: 'Invalid input' });
        }

        const AchievementFileName = `${new Date().getTime()}_${document.name.replace(/ /g, '')}`;
        const file = await fileFromPath(document, AchievementFileName);
        const AchievementFileCid = await storeFiles(file);

        const AchievementFileURL = `http://localhost:8081/ipfs/${AchievementFileCid}`;

        res.json({ AchievementFileURL });
    } catch (error) {
        console.log(`Problem while uploading achievement file to local IPFS server: ${error}`);
        return res.status(500).send({
            message: 'Problem while uploading achievement file to local IPFS server'
        });
    }
}

module.exports = { ipfsUpload,resumeUpload,ProjectFileUpload,AchievementFileUpload } 