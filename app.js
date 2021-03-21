require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser')
const Schema = mongoose.Schema;
const cors = require('cors');
const jackrabbit = require('jackrabbit');


const dataSchema = new Schema({
    name: String,
    email: String,
});

const Data = mongoose.model('CollectionName', dataSchema);
const app = express();

//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MongoID, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

//rabbitMQ

var rabbit = jackrabbit(process.env.CLOUDAMQP_URL);
var exchange = rabbit.default();

// var hello = exchange.queue({ name: 'example_queue', durable: true });
// //hello.consume(onMessage);

// function onMessage(data, ack) {
//     console.log('received:', data);
//     ack("");
// }

app.get('/', (req, res) => {
    res.send('Home: POST /set to add, GET /getAll to get all')
})
app.post('/setRecord', (req, res) => {

    const d = new Data({ name: req.body.name, email: req.body.email })
    d.save();

    exchange.publish({ msg: d._id }, { key: 'example_queue' });

    res.send('Updated')
});



app.get('/getRecord/:id', async (req, res) => {
    var id = req.params.id;
    console.log({ id });
    Data.findById(id).exec(async function (err, users) {
        console.log({ users });
        return res.send(users);
    });
});

app.listen(process.env.PORT, () => {
    console.log(`now listening for requests on port ${process.env.PORT}`);
});
