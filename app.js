var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = require('./routes/routing')
var indexRouter = require('./routes/index');
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './public/images' });
var usersRouter = require('./routes/routing');
const bodyParser=require("body-parser");
const cors = require('cors')
var app = express();
const fs = require('fs');
var path = require('path');
app.use(bodyParser.json());
var publicDir = require('path').join(__dirname);
app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname+'.jpg');
    }
});

var upload = multer({ storage: storage })

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.post('/upload/',upload.single('profile'),(req,res,next)=>{
    res.json(req.file.filename);
})

app.get('/getImage/:userName',(req,res,next)=>{
    let name = req.params.userName;
    const path = './public/images/'+name+'.jpg';
    try{
        if(fs.existsSync(path)){
            res.send('Found')
        }else{
            res.send('Not Found');
        }
    }
    catch(err){ 
        res.send()
    }
})

app.delete('/delete/:imageName',(req,res,next)=>{
    try{
        fs.unlinkSync(`public/images/${req.params.imageName}.jpg`);
        res.status(201).send({message:"Deleted Successfully"})
    } catch(e){
        res.status(400).send({message:"error"});
    }
})
app.use('/',router);
app.listen(process.env.PORT || 3220);
console.log("Server Started at port 3000!");
module.exports = app;
