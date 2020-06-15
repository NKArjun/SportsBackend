var express = require('express');
var router = express.Router();
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('MSG91');
const service = require('../service/user')
const messageBird = require('messagebird')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/setupDB', (req, res, next) => {
  service.insertScript().then(data => {
    if (data) {
      res.status(201);
      res.json({ message: data });
    }
  })
})

router.delete('/deleteAllDBs',(req,res,next)=>{
  service.deleteAllDBs().then(data =>{
    if(data){
      res.status(201);
      res.json({message:"All Databases are deleted"})
    }
  }).catch(err =>{
    next(err);
  })
})

router.get('/setupDBTeams', (req, res, next) => {
  service.initializeTeams().then(data => {
    if (data) {
      res.status(201);
      res.json({ message: "Inserted " + data + " document in database" });
    }
  }).catch(err =>{
    next(err);
  })
})

router.post('/register', (req, res, next) => {
  let user = req.body;
  service.createUser(user).then(response => {
    res.json({ message: response })
  }).catch(err => {
    next(err);
  })
})

router.get('/login',(req, res, next) => {
  service.validateLogin(req.query.userEmail, req.query.password).then(response => {
    res.json({ message: response })
  }).catch(err => {
    next(err);
  })
})

router.get('/checkPhoneNo',(req,res,next)=>{
  service.checkPhoneNo(req.query.phoneNo).then(response =>{
    res.json({message:response});
  }).catch(err =>{
    next(err);
  })
})

router.get('/changePassword',(req,res,next)=>{
  console.log('pass');
  console.log(req.query.userId);
  console.log(req.query.password);
  service.changePassword(req.query.userId,req.query.password).then(response =>{
    res.json({message:response});
  }).catch(err =>{
    next(err);
  })
})

router.get('/sendOtp',(req,res,next) =>{
  sendOtp.send(919585980126,"PRIIND","1234",(error,data)=>{
    res.send(error);
  })
})

router.get('/verifyOtp',(req,res,next)=>{
  sendOtp.verify("919585980126","1234",(error,data)=>{
    res.send(data);
  })
})
router.get('/getUser/:userId', (req, res, next) => {
  let userId = req.params.userId;
  service.getUser(userId).then(result => {
    res.json({ user: result });
  }).catch(err => {
    next(err);
  })
})

router.get('/getProfile/:userId', (req, res, next) => {
  let userId = req.params.userId;
  service.getProfile(userId).then(data => {
    res.json({ message: data })
  }).catch(err => {
    next(err);
  })
})

router.get('/getPlayersDetails', (req, res, next) => {
  service.gerPlayers().then(data => {
    res.json({ message: data });
  }).catch(err => {
    next(err);
  })
})

router.post('/createTeam', (req, res, next) => {
  console.log('createTeam')
  let form = req.body;
  console.log(form);
  service.createTeam(form).then(data => {
    res.json({ message: data })
  }).catch(err => {
    next(err);
  })
})

router.get('/getTeam/:teamCode', (req, res, next) => {
  let code = req.params.teamCode;
  service.getTeam(code).then(data => {
    res.json({ message: data })
  }).catch(err => {
    next(err);
  })
})

router.get('/getTeams', (req, res, next) => {
  service.getTeams().then(data => {
    res.json({ Teams: data });
  }).catch(err => {
    next(err);
  })
})

router.get('/joinTeam/:userId/:captainId/:teamCode', (req, res, next) => {
  const userId = req.params.userId;
  const captainId = req.params.captainId;
  const teamCode = req.params.teamCode;
  console.log(userId, captainId, teamCode);
  service.joinTeam(userId, captainId, teamCode).then(result => {
    res.json({ result })
  }).catch(err => {
    next(err);
  })
})

router.put('/acceptPlayer', (req, res, next) => {
  let notification = req.body;
  service.acceptPlayer(notification).then(result => {
    res.json({ result })
  }).catch(err => {
    next(err);
  })
})

router.post('/sendNotificationToUsers', (req, res, next) => {
  let message = req.body.message;
  console.log(message);
  service.sendNotificationToUsers(message).then(result => {
    res.json({ result });
  }).catch(err => {
    next(err);
  })
})

router.post('/updateProfile', (req, res, next) => {
  let profile = req.body;
  console.log(profile);
  service.updateProfile(profile).then(result =>{
    res.json({message:result});
  }).catch(err =>{
    next(err);
  })
})

module.exports = router;
