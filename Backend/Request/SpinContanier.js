const express = require("express");
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const deployment=require("../models/DeploymentSchema")
router.post('/create-deployemnt',async (req, res) => {
    const Deployment=await deployment.create({
        projectId:req.body.projectId,
        status:"Queued",
    })
    const deploy=await Deployment.populate("projectId")
    const variable1=deploy.projectId.repositoryUrl;
    const variable2=deploy.projectId.ProjectId;
    const variable3=Deployment._id;

    // console.log(project)
    // res.send(project);
  
    // const { variable1, variable2 } = req.body;

    const yamlTemplate = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: new2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - image: vercelclone.azurecr.io/vercelimg
          name: vercelclone
          env:
            - name: GIT_REPOSITORY__URL
              value: ${variable1}
            - name: PROJECT_ID
              value: ${variable2}
            -name:DeploymentId
              valueL:${variable3}
          ports:
            - containerPort: 80
`;

    // Write the YAML content to the temp.yaml file
    fs.writeFileSync('temp.yaml', yamlTemplate);

    // Execute kubectl apply command to create the pod in AKS
    exec(`kubectl apply -f temp.yaml`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing kubectl: ${error.message}`);
            await deployment.findByIdAndUpdate(Deployment._id,{status:"stopped"})
            console.log(await deployment.findOne({_id:Deployment._id}))
            res.status(500).send('Internal Server Error');
            return;
        }
        if (stderr) {
            console.error(`kubectl stderr: ${stderr}`);
            await deployment.findByIdAndUpdate(Deployment._id,{status:"stopped"})
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`kubectl stdout: ${stdout}`);
        res.status(200).send('Pod created successfully');
    });
});
module.exports = router;

