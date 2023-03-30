const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Minimum password length is 6']
    },
    sid: {
        type: String
    }
}); 

// before doc saved to doc
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.post('save', (doc, next) => {
    console.log('new user was created and saved', doc);
    next();
})

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });  // finds particular id
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;    // logged in
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;