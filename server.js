const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const app = express();
const appPort = 7036;
const mongoosePort = 27017;
const host = 'localhost';
const mongooseUrl = `mongodb://${host}:${mongoosePort}/mongoose?authSource=admin`;
const { User } = require('./db/user_model');

var JWTToken												

/* View engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

mongoose.set('strictQuery', false);

/* Initialize mongoose connection */
const init = async() => {
    try {
        await mongoose.connect(mongooseUrl);
        app.listen(appPort, () => console.log(`Server listening on port ${appPort}`));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

init()

/* GET */
app.get('/', async (_, res) => {
    res.render('index');
});

app.get('/login', async (_, res) => {
    res.render('partials/login');
});

app.get('/register', async (_, res) => {
    res.render('partials/register')
});

app.get('/fail', async (_, res) => {
    res.render('partials/fail');
});

app.get('/start', async (_, res) => {
    res.render('partials/start');
});

/* POST */
app.post('/register', async (req, res) => {
    const user = new User({...req.body});
    const userExists = await User.findOne({ username: user.username });
    if (!userExists) {
        user.save()
            .then((_) => {
                console.log("User created");
                res.status(200).send('/login');
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send('/fail');
            });
    } else {
        console.log("User could not be created");
        res.status(400).send('/fail');
    }
});

app.post('/login', async (req, res) => {
    const inputUser = new User({...req.body});
    try {
        let data = await User.findOne({ username: inputUser.username });
        if (!data) {
            console.log("No user")
            res.status(400).send('/fail');
            return
        } else {
            let user = data;
            user.comparePassword(inputUser.password, (err, isMatch) => {
                if (isMatch) {
                    createToken(inputUser.password);
                    console.log(`User ${user.username} found`);
                    res.status(200).send('/start');
                } else {
                    console.log("Incorrect password");
                    res.status(400).send('/fail');
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(405).send('/fail');
    }
});

function createToken(salt) {
    const hmac = crypto.createHmac('sha256', salt);
    const data = hmac.update('lab3');
    JWTToken = data.digest('hex');
    console.log("HMAC JWT : " + JWTToken);
}