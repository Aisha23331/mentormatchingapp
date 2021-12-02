const Customer = require('./Customer');
const Mentor = require('./Mentor');

class Mentee extends Customer {
    constructor(Email, Password, Profile) {
        super(Email, Password, Profile);

        this.connections = [];
    }

    connect(mentor) {
        if (this.connections.indexOf(mentor) == -1) {
            this.connections.add(mentor);
            console.log('mentee connected')
        }
        else {
            console.log('mentee is already a connection')
        }
    }

    notifyOfDeniedConnection(mentor) {

    }
}

module.exports = Mentee;