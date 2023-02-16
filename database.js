var MongoClient = require('mongodb').MongoClient;
const baseUrl = 'mongodb://localhost:5050/users'

MongoClient.connect(`${baseUrl}`, (err, db) => {
  console.log(err)
  if (err) throw err

  var user = { username: "Adis", password: "1234" }

  db.collection('users').insertOne(user, (err, res) => {
    if (err) throw err;
    console.log('User inserted');
    db.close();
  })
});