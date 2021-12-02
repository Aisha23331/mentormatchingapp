const Conversation = require('./Conversation')

class Message {
    constructor(Sender, Reciever, Message) {
        this.sender = Sender;
        this.reciever = Reciever;
        this.message = Message;

        this.timestamp = Date.now();
    }
}

module.exports = Message;