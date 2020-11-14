const jwt = require('express-jwt');

const getTokenFromHeaders = req => {
    const { headers: {authorization} } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') { // TODO refactor
        return authorization.split(' ')[1]; // TODO also refactor
    }

    return null; // TODO refactor
}


const auth = {
    require: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['RS256']
    })
}

module.exports = auth;