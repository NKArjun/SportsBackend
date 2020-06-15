const collection = require('../utilities/connection');
const initialData = require('./data.json');
const User = require('./userDetails');
const initialTeams = require('./teams.json');
const Cricket = require('./cricketDetails');
const Team = require('./teamDetails');
let model = {};

model.generateId = () => {
    return collection.getCollection().then(model => {
        return model.count('userId').then(ids => {
            return ids;
            // var max = 0;
            // console.log(ids);
            // if (ids.length == 0) {
            //     return 101
            // }
            // for (let i = 0; i < ids.length; i++) {
            //     var sub = ids[i].substr(1, 4);
            //     if (sub > max) {
            //         max = sub;
            //     }
            // }
            // max = parseInt(max);
            // return max + 1;
        })
    })
}

model.generateTeamCode = () => {
    return collection.getTeamCollection().then(model => {
        return model.count('teamCode').then(ids => {
            console.log(ids);
            // var max = 0;
            // if (ids.length == 0) {
            //     return 101;
            // }
            // for (let i = 0; i < ids.length; i++) {
            //     var sub = ids[i].substr(4, 7);
            //     if (sub > max) {
            //         max = sub;
            //     }
            // }
            // max = parseInt(max);
            return ids + 1;
        })
    })
}

model.inserScript = () => {
    return collection.getCollection().then(collection => {
        return collection.deleteMany().then(data => {
            return collection.insertMany(initialData).then(response => {
                if (response && response.length > 0) {
                    return response.length;
                } else {
                    let err = new Error("Insertion Failed");
                    err.status = 500;
                    throw err;
                }
            })
        })
    })
}

model.initializeAllSports = (Id) => {
    collection.getCricketCollection().then(dbModel => {
        let details = new Cricket();
        details.userId = Id;
        dbModel.create(details).then(data => {
            if (!data) {
                let err = new Error("Error Occurred in creating player profile");
                err.status = 500;
                throw err;
            }
        })
    })
}

model.initializeTeams = () => {
    return collection.getTeamCollection().then(dbModel => {
        return dbModel.deleteMany().then(data => {
            return dbModel.create(initialTeams).then(response => {
                console.log(response);
                if (response) {
                    return response;
                } else {
                    let err = new Error("Insertion Failed");
                    err.status = 500;
                    throw err;
                }
            })
        })
    })
}

model.deleteAllDBs = () =>{
    return collection.getCollection().then(dbModel =>{
        return dbModel.deleteMany({}).then(data =>{
            return collection.getCricketCollection().then(dbModel =>{
                return dbModel.deleteMany({}).then(data =>{
                    return collection.getTeamCollection().then(dbModel =>{
                        return dbModel.deleteMany({}).then(data =>{
                            return "All Datas are Deleted";
                        })
                    })
                })
            })
        })
    })
}

model.createUser = (user) => {
    let details = new User(user);
    console.log(details);
    return collection.getCollection().then(collection => {
        return model.generateId().then(id => {
            id = id+100+1;
            let uid = 'U' + id;
            details.userId = uid;
            console.log(details);
            return collection.find({ email: details.email }).then(data => {
                if (data.length == 0) {
                    console.log(data);
                    return collection.create(details).then(data => {
                        if (data) {
                            model.initializeAllSports(uid);
                            return "Successfully Registered";
                        }
                        else {
                            let err = new Error('Error Occured in Database');
                            err.status = 500;
                            throw err;
                        }
                    })
                } else {
                    let err = new Error("Entered mailId is already registered");
                    err.status = 200;
                    throw err;
                }
            })
        })
    })
}

model.validateLogin = (uemail, pass) => {
    return collection.getCollection().then(collection => {
        return collection.findOne({ email: uemail, password: pass }).then(data => {
            return data;
        })
    })
}

model.getUser = (uId) => {
    console.log(uId);
    return collection.getCollection().then(dbModel => {
        return dbModel.findOne({ userId: uId }).then(data => {
            if (data) return data;
            else return null;
        })
    })
}

model.checkPhoneNo = (phoneNo) =>{
    return collection.getCollection().then(dbModel =>{
        return dbModel.findOne({"phoneNo":phoneNo}).then(data =>{
            if(data) return data;
            else return null;
        })
    })
}

model.changePassword = (userId,password) =>{
    return collection.getCollection().then(dbModel =>{
        return dbModel.update({"userId":userId},{$set:{"password":password}}).then(data =>{
            console.log(data);
            if(data.nModified == 1) return "Successfully Password Changed";
            else return null;
        })
    })
}

model.getProfile = (uId) => {
    return collection.getCricketCollection().then(dbModel => {
        return dbModel.findOne({ userId: uId }).then(data => {
            return data;
        })
    })
}

model.getPlayers = () => {
    return collection.getCollection().then(dbModel => {
        return dbModel.find({}, { email: 1, firstName: 1, lastName: 1, userId: 1, _id: 0 }).then(data => {
            return data;
        })
    })
}

model.createTeam = (form) => {
    let details = new Team(form);
    return collection.getTeamCollection().then(dbModel => {
        return model.generateTeamCode().then(teamCode => {
            let code = "Team" + (teamCode+100);
            details.teamCode = code;
            return dbModel.create(details).then(result => {
                if (result) return code;
                else return null;
            })
        })
    })
}

model.getTeam = (TeamId) => {
    return collection.getTeamCollection().then(dbModel => {
        return dbModel.findOne({ teamCode: TeamId }).then(teamDetails => {
            if (teamDetails == null) return null;
            else return teamDetails;
        })
    })
}

model.getTeams = () => {
    return collection.getTeamCollection().then(dbModel => {
        return dbModel.find({}).then(teams => {
            if (teams.length > 0) return teams;
            else return null;
        })
    })
}

model.joinTeam = (userId, captainId, teamCode) => {
    return collection.getCollection().then(dbModel => {
        var request = {
            "joinUserId": userId,
            "teamCode": teamCode,
            "notification": userId + " has requested to join in your cricket Team"
        }
        return dbModel.find({ "notifications": { $elemMatch: { "joinUserId": userId } } }).then(data => {
            if (data.length == 0) {
                return dbModel.updateOne({ "userId": captainId }, { $push: { "notifications": request } }).then(result => {
                    if (result.nModified == 1) {
                        return result;
                    }
                    else return null;
                })
            } else return "Already Notification Sent";
        })
    })
}

model.acceptPlayer = (notification) => {
    const joinuserId = notification.joinUserId;
    const teamCode = notification.teamCode;
    const userId = notification.userId;
    return collection.getCollection().then(dbModel => {
        return dbModel.findOne({ "userId": joinuserId }).then(data => {
            if (data) {
                let player = {
                    "userId": data.userId,
                    "firstName": data.firstName,
                    "lastName": data.lastName,
                    "playerMailId": data.email
                }
                return collection.getTeamCollection().then(Model => {
                    return Model.find({ "teamCode": teamCode, "players": { $elemMatch: { "userId": joinuserId } } }).then(data => {
                        if (data.length == 0) {
                            return Model.update({ "teamCode": teamCode }, { $push: { "players": player } }).then(result => {
                                if (result.nModified == 1) {
                                    return collection.getCollection().then(model => {
                                        return model.update({ "userId": userId }, { $pull: { "notifications": { "teamCode": teamCode } } }).then(res => {
                                            if (res.nModified == 1) {
                                                return result
                                            } else return null;
                                        })
                                    })
                                } else return null;
                            })
                        } else return "Player is already added in this team";
                    })
                })
            }
        })
    })
}

model.sendNotificationToUsers = (message) => {
    console.log('model', message);
    return collection.getCollection().then(dbModel => {
        return dbModel.update({}, { $push: { "notifications": { "message": message } } }, { multi: true }).then(result => {
            console.log(result);
            if (result.nModified > 0) {
                return "Notifications Send";
            } else return null;
        })
    })
}

model.updateProfile = (profile) => {
    return collection.getCricketCollection().then(dbModel => {
        return dbModel.update({"userId":profile.userId}, { $set: { "battingType": profile.batsman, "bowlingType": profile.bowler, "ability": profile.ability } }).then(result => {
            if (result.nModified > 0) {
                return "Profile Updated";
            } else return null;
        })
    })
}
module.exports = model;