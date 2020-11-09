const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();

const auth = require('../auth');
const Users = mongoose.model('Users');


// POST new user route (optional, everyone has acess)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user }} = req;

    // TODO refactor
    if (!user.email) {
        return res.status(422).json({eroros: { emai: 'is required'}});
    }

    if (!user.password) {
         return res.status(422).json({eroros: { password: 'is required'}});
    }

    const finalUser = new Users(user);
    finalUser.setPassword(user.password);

    return finalUser.save()
    .then(() => res.json({user: finalUser.toAuthJSON()}));
});


// POST login route (optional, everyone has acess)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user }} = req;

    // TODO refactor
    if (!user.email) {
        return res.status(422).json({eroros: { emai: 'is required'}});
    }

    if (!user.password) {
         return res.status(422).json({eroros: { password: 'is required'}});
    }

    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }
        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({user: user.toAuthJSON() });
        }

        return status(400).info;
    })(req, res, next); // TODO maybe refactor
});

// GET current route (requierd, only authenticated users have acess)
// router.get('/current', auth.requierd, (req, res, next) => {
//     const { payload: { id } } = req;

//     return Users.findById(id)
//     .then((user) => {
//         if (!user) {
//             return res.sendStatus(400);
//         }

//         return res.json({ user: user.toAuthJSON() });
//     });
// });

module.exports = router;