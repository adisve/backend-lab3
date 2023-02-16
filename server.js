const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const appPort = 7036;
const mongoosePort = 27017;
const host = 'localhost';
const mongooseUrl = `mongodb://${host}:${mongoosePort}/mongoose?authSource=admin`;
const { User } = require('./db/user_model');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());


/* View engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')))

mongoose.set('strictQuery', false);

/* Initialize mongoose connection */
const init = async() => {
    try {
        console.log(path.join(__dirname))
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
    res.redirect('/index')
});

app.get('/login', async (_, res) => {
    res.render('login');
});

app.get('/register', async (_, res) => {
    res.render('register')
});

app.get('/index', async (_, res) => {
    res.render('index');
});

app.get('/fail', async (_, res) => {
    res.render('fail');
});

/* POST */
app.post('/register', async (req, res) => {
    const user = new User({...req.body});
    const userExists = await User.findOne({ username: user.username });
    if (!userExists) {
        user.save()
            .then((_) => {
                console.log("User created");
                res.status(200).send('/fail');
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
            res.status(400);
            return
        } else {
            let user = data;
            user.comparePassword(inputUser.password, (err, isMatch) => {
                if (isMatch) {
                    console.log(`User ${user.username} found`);
                    res.status(200).redirect('/fail');
                } else {
                    console.log("Incorrect password");
                    res.status(400);
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(405);
    }
});