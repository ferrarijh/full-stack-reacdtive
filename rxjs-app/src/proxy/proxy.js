const https = require('https')
const express = require('express')
const app = express()
const hostname = 'localhost';
const port = 3001;

app.use(express.json())

app.post('/', (req, res)=>{
    targetUrl = req.body['targetUrl']
    console.log("targetUrl:", targetUrl)

    const nodeReq = https.request(targetUrl, nodeRes=>{
        data = ''
        nodeRes.on('data', d=>{
            console.log('data:', d)
            data += d
        })
        nodeRes.on('end', ()=>{
            res.send(data)
        })
    })
    
    nodeReq.on('error', e=>{
        res.send('error:', e)
    })
    nodeReq.end()
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});