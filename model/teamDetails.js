class Team{
    constructor(obj){
        this.teamCode = obj.teamCode;
        this.sport = obj.sport;
        this.players = obj.players;
        this.location = obj.location;
        this.ground = obj.ground;
        this.captainUserId = obj.captainUserId;
    }
}

module.exports = Team;