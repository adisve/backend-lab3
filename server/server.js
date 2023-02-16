const express = require('express');
const app = express();
const port = 7036
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json())

var dbEncryption

app.get('/', (req, res) => {
    res.render('view.ejs');
});

app.post('/', async (req, res) => {
    if (req.body.encrypt != '') {
        try {
            dbEncryption = await bcrypt.hash(req.body.encrypt, 18);
        } catch (err) {
            console.log(err)
        }
    }

    req.method = 'GET'
    req.redirect('/')
});

app.listen(port)