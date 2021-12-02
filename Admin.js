const User = require('./User');
const Report = require('./Report');

class Admin extends User {
    constructor(Email, Password) {
        super(Email, Password);
    }

    viewReport(report) {
        
    }

    banCustomer(customer) {
        //this.registry.addBannedEmail(customer.email);
    }
}

module.exports = Admin;