const express = require("express") 
const router = express.Router() 
const fileUpload = require('express-fileupload')
const ipfsController = require('../controllers/ipfsController')

router.use(fileUpload({useTempFiles: true}));

router.post("/file-upload",ipfsController.ipfsUpload)
router.post("/resume-upload",ipfsController.resumeUpload)
router.post("/project-upload",ipfsController.ProjectFileUpload)
router.post("/achievement-upload",ipfsController.AchievementFileUpload)


module.exports = router;
