const express = require('express');
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.text())
app.post('/api/add',async(req,res)=>{
    return res.status(200).json({
        message:"data added successfully"
    })
})
const port = 6001;
app.listen(port,()=>{
    console.log(`${port} is connected`)
})