const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const appPort = process.env.PORT || 8080;
const mongoosePort = process.env.MONGODB_PORT || 27017;
const host = process.env.HOST || 'localhost';
const mongooseUrl = `mongodb://${host}:${mongoosePort}/mongoose?authSource=admin`;
const { User } = require('./db/user_model');

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
        app.listen(appPort, () => console.log(`Server listening on port ${appPort} at http://localhost:${appPort}/`));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

init();

/* Routes */
const indexRoute = express.Router();
const authRoute = express.Router();

app.use('/', indexRoute);
app.use('/auth', authRoute);

indexRoute.get('/', async (_, res) => {
    res.render('index');
});

authRoute.get('/login', async (_, res) => {
    res.render('partials/login');
});

authRoute.get('/register', async (_, res) => {
    res.render('partials/register')
});

authRoute.get('/fail', async (_, res) => {
    res.render('partials/fail');
});

authRoute.get('/start', async (_, res) => {
    res.render('partials/start');
});

authRoute.post('/register', async (req, res) => {
    const user = new User({...req.body});
    try {
        const userExists = await User.findOne({ username: user.username });
        if (userExists) {
            console.log("User already exists");
            res.status(400).send('/auth/fail');
            return;
        }
        await user.save();
        console.log("User created");
        res.status(200).send('/auth/login');
    } catch (err) {
        console.log(err);
        res.status(400).send('/auth/fail');
    }
});

authRoute.post('/login', async (req, res) => {
  const inputUser = new User({...req.body});
  try {
    const user = await User.findOne({ username: inputUser.username });
    if (!user) {
      console.log("User not found");
      res.status(400).send('/auth/fail');
      return;
    }
    const isMatch = await user.comparePassword(inputUser.password);
    if (!isMatch) {
      console.log("Incorrect password");
      res.status(400).send('/auth/fail');
      return;
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    console.log(`User ${user.username} found`);
    res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true });
    res.status(200).send('/auth/start');
  } catch (err) {
    console.log(err);
    res.status(400).send('/auth/fail');
  }
});