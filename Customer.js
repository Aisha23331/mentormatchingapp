const User = require('./User');
const Profile = require('./Profile');
const Message = require('./Message');
const registry = require('./Registry');

class Customer extends User {
    constructor(Email, Password, Profile) {
        super(Email, Password);

        this.profile = Profile; //Different from class diagram, make profile before customer seperately
    }

    //requestHelp()

    recommendMatches(matches) {

    }

    getConnectionRequests() {

    }

    acceptConnectionRequest(customer) {

    }

    denyConnectionRequest(customer) {

    }

    disconnect(customer) {

    }

    sendMessage(conversation, message) {

    }

    //uploadFile()

    reportProfile(profile, reason) {

    }

    notifyOfBan(reason) {

    }

    notifyOfAcceptedConnection(customer) {

    }

    //getProfile() (use customer.profile)
}

module.exports = Customer;