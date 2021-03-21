require('dotenv').config()
const jackrabbit = require('jackrabbit');

//rabbitMQ

var rabbit = jackrabbit(process.env.CLOUDAMQP_URL);
var exchange = rabbit.default();

var hello = exchange.queue({ name: 'example_queue', durable: true });
hello.consume(onMessage);

function onMessage(data, ack) {
    console.log('received:', data);
    ack("");
}