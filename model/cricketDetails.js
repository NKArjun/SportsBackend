class Cricket{
    
    constructor(){
        var value = {
            "matches":0,
            "runs":0,
            "highestscore":0,
            "average":0,
            "wickets":0,
            "bestbowlingfigure":0,
            "economy":0,
            "strikerate":0,
            "battingType":null,
            "bowlingType":null,
            "ability":null
        }
        this.userId = value.userId;
        this.matches = value.matches;
        this.runs = value.runs;
        this.highestscore = value.highestscore;
        this.average = value.average;
        this.wickets = value.wickets;
        this.bestbowlingfigure = value.bestbowlingfigure;
        this.economy = value.economy;
        this.strikerate = value.strikerate;
        this.battingType = value.battingType;
        this.bowlingType = value.bowlingType;
        this.ability = value.ability;   
    }
}

module.exports = Cricket;