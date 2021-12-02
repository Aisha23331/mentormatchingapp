const registry = require('./Registry');
const Conversation = require('./Conversation');

class User {
    constructor(Email, Password) {
        this.email = Email;
        this.password = Password;
    }

    //login(email, password)

    //logout()

    //changePassword()

    //searchCustomer(filter)

    //viewProfile(profile)

    getConversation(user) {

    }

    //viewConversation(conversation)

    //getEmail() (because attributes are public... user.email)
}

module.exports = User;