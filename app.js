require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser')
const Schema = mongoose.Schema;
const cors = require('cors');


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


app.get('/', (req, res) => {
    res.send('Home: POST /set to add, GET /getAll to get all')
})

app.post('/setRecord', (req, res) => {
    console.log({ req });
    const d = new Data({ name: req.body.name, email: req.body.email })
    d.save();
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
