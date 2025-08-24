const http = require('http');
const app = require('./app');
const port = process.env.PORT;
const server = http.createServer(app).listen(port,()=>{
    console.log(`server running on port ${port}`);
    
})