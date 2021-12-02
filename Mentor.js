const Customer = require('./Customer');

class Mentor extends Customer {
    constructor(Email, Password, Profile) {
        super(Email, Password, Profile);

        this.connections = [];
    }

    connect(mentee) {
        if (this.connections.indexOf(mentee) == -1) {
            this.connections.add(mentee);
            console.log('mentee connected')
        }
        else {
            console.log('mentee is already a connection')
        }
    }
}

module.exports = Mentor;