const bcrypt = require('bcrypt');

// this takes in a password and checks that when it's run through the hashing algo, it matches the user's hash
async function validPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

// generates and returns hashed password
async function genPassword(password) {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err,hash) {
            if (err) console.err(err);
            resolve(hash);
        });
    });
    return hashedPassword;
}

module.exports = { validPassword, genPassword };