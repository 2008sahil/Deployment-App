const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3000;
const { Server } = require("socket.io");
const Redis = require('ioredis')

app.use(express.json());

const subscriber = new Redis("rediss://default:AVNS_edhWdX1DQ5AqBUTmw59@redis-11685dad-vercelclone.a.aivencloud.com:25620")

// const io = new Server({ cors: '*' })

// io.on('connection', socket => {
//   socket.on('subscribe', channel => {
//       socket.join(channel)
//       socket.emit('message', `Joined ${channel}`)
//   })
// })


app.post('/create-pod', (req, res) => {
    // Extract variables from the POST request payload
    const { variable1, variable2 } = req.body;

    // Define the YAML template with placeholders for variables
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
          ports:
            - containerPort: 80
`;

    // Write the YAML content to the temp.yaml file
    fs.writeFileSync('temp.yaml', yamlTemplate);

    // Execute kubectl apply command to create the pod in AKS
    exec(`kubectl apply -f temp.yaml`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing kubectl: ${error.message}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (stderr) {
            console.error(`kubectl stderr: ${stderr}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(`kubectl stdout: ${stdout}`);
        res.status(200).send('Pod created successfully');
    });
});


// async function initRedisSubscribe() {
//   console.log('Subscribed to logs....')
//   subscriber.psubscribe('logs:*')
//   subscriber.on('pmessage', (pattern, channel, message) => {
//       io.to(channel).emit('message', message)
//   })
// }


// initRedisSubscribe()


// io.listen(9002, () => console.log('Socket Server 9002'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
