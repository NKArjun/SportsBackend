class User{
    constructor(obj){
        this.userId = obj.userId;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.password = obj.password;
        this.email = obj.email;
        this.phoneNo = obj.phoneNo;
        this.notifications = [{"joinUserId":null,"teamCode":null,"notification":null}];
    }
}

module.exports = User;