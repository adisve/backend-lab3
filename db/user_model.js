var mongoose = require('mongoose');
Schema = mongoose.Schema;
bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

const UserModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    }
});

UserModel.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserModel.methods.comparePassword = function(candidatePassword, completion) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            console.log(err);
            return completion(err);
        }
        completion(null, isMatch);
    });
};

const User = mongoose.model('User', UserModel);

module.exports = { User };