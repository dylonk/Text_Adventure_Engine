const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:{ type: String, required: true,unique:true },
    password: { type: String, required: true },
});

UserSchema.pre('save', async function(next) {
    // Comment out the password hashing logic for testing
    // if (!this.isModified('password')) return next();
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();  // Skip hashing for now
});

const User = mongoose.model('User', UserSchema); //this is the user that is logged in.
module.exports = User;  //exports the user module, so it can be used throughout the application.

