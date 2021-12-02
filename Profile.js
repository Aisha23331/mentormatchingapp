const Customer = require('./Customer');

class Profile {
    constructor(Name, Role, Sex, Age) {
        this.name = Name;
        this.role = Role;
        this.sex = Sex;
        this.age = Age;

        this.selfDescription = "";
        this.skillsAndExperience = "";
        this.qualifications = "";
        
        this.accountType = "";
    }
}

module.exports = Profile;