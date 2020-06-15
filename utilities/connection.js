const mongoose = require('mongoose');
mongoose.promise = global.promise;
const Schema = mongoose.Schema;
const connString = require('./environment');
mongoose.set("useCreateIndex", true);

let connectionString = "mongodb://" + connString.accountName + ":" + connString.key + "@"
    + connString.accountName + ".documents.azure.com:"
    + connString.port + "/" + connString.databaseName + "?ssl=true"

let user = {
    "userId": { type: String, unique: true },
    "firstName": { type: String, required: true },
    "lastName": { type: String, required: true },
    "password": { type: String, required: true },
    "phoneNo": { type: String },
    "notifications": [{
        "joinUserId": String,
        "teamCode": String,
        "notification": String
    }
    ],
    "teams": { type: Array },
    "email": { type: String, unique: true },
}

let cricket = {
    "userId": { type: String, unique: true },
    "battingType": { type: String },
    "bowlingType": { type: String },
    "ability": { type: String },
    "matches": { type: String },
    "runs": { type: String },
    "highestscore": { type: String },
    "average": { type: String },
    "strikerate": { type: String },
    "wickets": { type: String },
    "bestbowlingfigure": { type: String },
    "economy": { type: String }
}

let team = {
    "teamCode": { type: String, unique: true },
    "sport": { type: String },
    "players": [
        {
            "userId": { type: String },
            "firstName": { type: String },
            "lastName": { type: String },
            "playerMailId": { type: String },
        }
    ],
    "location": { type: String },
    "ground": { type: String },
    "captainUserId": { type: String }
}
let UserSchema = new Schema(user, { collection: "User", timestamps: true })
let connection = {}
connection.getCollection = () => {
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, }).then(db => {
        return db.model("User", UserSchema);
    }).catch(err => {
        let error = new Error("Could not connect to Database");
        error.status = 500;
        throw error;
    })
}

//"mongodb://localhost:27017/sports", { useNewUrlParser: true }
let cricketSchema = new Schema(cricket, { collection: "Cricket", timestamps: true })
connection.getCricketCollection = () => {
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, }).then(db => {
        return db.model("Cricket", cricketSchema);
    }).catch(err => {
        let error = new Error("Could not connect to Database");
        error.status = 500;
        throw error;
    })
}

let teamSchema = new Schema(team, { collection: "Team", timestamps: true });
connection.getTeamCollection = () => {
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, }).then(db => {
        return db.model("Team", teamSchema);
    }).catch(err => {
        let error = new Error("Could not connect to Database");
        error.status = 500;
        throw error;
    })
}
module.exports = connection;