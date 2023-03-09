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

const User = mongoose.model('user', userSchema);

module.exports = User;