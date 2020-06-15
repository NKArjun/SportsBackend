const dbLayer = require('../model/user');

let service = {};

service.insertScript = () =>{
    return dbLayer.inserScript().then(data =>{
        return data;
    })
}

service.initializeTeams = () =>{
    return dbLayer.initializeTeams().then(data =>{
        console.log(data.teamCode);
        return data;
    })
}

service.deleteAllDBs = () =>{
    return dbLayer.deleteAllDBs().then(data =>{
        return data;
    })
}
service.validateLogin = (email,pass) =>{
    return dbLayer.validateLogin(email,pass).then(response =>{
        if(response == null){
            let err = new Error("User does not exit");
            err.status = 401;
            throw err;
        }else{
            return response;
        }
    })
}

service.checkPhoneNo = (phoneNo) =>{
    return dbLayer.checkPhoneNo(phoneNo).then(response =>{
        if(response == null){
            let err = new Error("Entered Phone No is not Registered");
            err.status = 400;
            throw err;
        }else{
            return response;
        }
    })
}

service.changePassword = (userId,password) =>{
    return dbLayer.changePassword(userId,password).then(response =>{
        if(response == null){
            let err = new Error("Password is not Changed");
            err.status = 400;
            throw err;
        }else{
            return response;
        }
    })
}

service.createUser = (user) =>{
    return dbLayer.createUser(user).then(data =>{
        return data;
    })
}

service.getUser = (uId) =>{
    return dbLayer.getUser(uId).then(data =>{
        if(data == null){
            let err = new Error('User Not Found');
            err.status = 404;
            throw err;
        }else return data;
    })
}

service.getProfile = (uId) =>{
    return dbLayer.getProfile(uId).then(data =>{
        if(data==null){
            let err = new Error('Profile Not Found');
            err.status = 401;
            throw err;
        }else return data;
    })
}

service.gerPlayers = () =>{
    return dbLayer.getPlayers().then(data =>{
        if(data == null){
            let err = new Error('Registered Players are not available');
            err.status = 401;
            throw err;
        }else return data;
    })
}

service.createTeam = (form) =>{
    return dbLayer.createTeam(form).then(data =>{
        if(data == null){
            let err = new Error("Team is not created Please try again later!");
            err.status = 401;
            throw err;
        }else{
            return data;
        }
    })
}

service.getTeam = (TeamId) =>{
    return dbLayer.getTeam(TeamId).then(data =>{
        if(data == null){
            let err = new Error('Enter Valid Team Code');
            err.status = 400;
            throw err;
        }else return data;
    })
}

service.getTeams = () =>{
    return dbLayer.getTeams().then(data =>{
        if(data == null){
            let err = new Error('Teams Not Found');
            err.status = 400;
            throw err;
        }else return data;
    })
}

service.joinTeam = (userId,captainId,teamCode) =>{
    return dbLayer.joinTeam(userId,captainId,teamCode).then(data =>{
        if(data == null){
            let err = new Error("Request Failed");
            err.status = 400;
            throw err;
        }else return data;
    })
}

service.acceptPlayer = (notification) =>{
    return dbLayer.acceptPlayer(notification).then(data =>{
        if(data == null){
            let err = new Error("Player not joined in team");
            err.status = 400;
            throw err;
        }else return data;
    })
}

service.sendNotificationToUsers = (message) =>{
    console.log('service',message);
    return dbLayer.sendNotificationToUsers(message).then(data =>{
        if(data == null){
            let err = new Error('Notifications not send');
            err.status = 500;
            throw err
        }else return data;
    })
}

service.updateProfile = (profile) =>{
    return dbLayer.updateProfile(profile).then(data =>{
        if(data == null){
            let err = new Error('Profile Not Updated');
            err.status = 500;
            throw err;
        }else return data;
    })
}
module.exports = service;