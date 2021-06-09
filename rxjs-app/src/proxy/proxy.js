const https = require('https')
const express = require('express')
const app = express()
const hostname = 'localhost';
const port = 3001;
const fetch = require('node-fetch')

app.use(express.json())

app.post('/', (req, res)=>{
    targetUrl = req.body['targetUrl']
    console.log("targetUrl:", targetUrl)

    fetch(targetUrl)
        .then(resp=>resp.json())
        .then(jsonRes=>res.json(jsonRes))

    // const nodeReq = https.request(targetUrl, nodeRes=>{
    //     data = ''
    //     nodeRes.on('data', d=>{
    //         // console.log('data:', d)
    //         data += d
    //     })
    //     nodeRes.on('end', ()=>{
    //         res.json(JSON.parse(data))
    //     })
    // })
    
    // nodeReq.on('error', e=>{
    //     res.e(e)
    // })
    // nodeReq.end()
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});