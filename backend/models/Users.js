const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const { Schema } = mongoose;

const UserScheme = new Schema({
    email: String,
    hash: String,
    salt: String
}); // Описание того как будет выглядеть схема

/* Создание методов для схемы  */
UserScheme.methods.setPassword = function (password) { // функция по созданию пароля
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pdkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex'); // в бд храним не пароль, а hash и salt
}

UserScheme.methods.validatePassword = function(password) { // функция по валидации пароля
    const hash = crypto.pdkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex'); // валидация пароля - сравниваем хэши
    return this.hash === hash;
}

UserScheme.methods.generateJWT = function() { // функция для генерации jwt токена (который имеет срок годности)
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, 'secret'); // 'secret' - можно поменять
}

UserScheme.methods.toAuthJSON = function() { // фукнция по использованию генерации jwt токена.
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT()
    };
};

/*  */

//  Создание модели Users на основе UserScheme
mongoose.model('Users', UserScheme);