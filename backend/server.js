const express = require('express');
const path = require('path');
const bodyParse = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorHandler');

const app = express();

/*  Configurate app */

app.use(cors()); // Для работы с cors
app.use(require('morgan')('dev')); // Для работы с логированием
app.use(bodyParser.urlencoded({ extended: false })); // для работы post запросами где строки или массивы
app.use(bodyParser.json()); // для работы с post запросами формата json
app.use(express.static(path.join(__dirname, 'public'))); // для работы с файловой системой, конкретно тут - куда кидать статику
app.use(session({secret: 'jwt-auth', cookie:  {maxAge: 6000}, resave: false, saveUninitialized: false})); // для работы с сессиями (maxAge - длительность жизни)

/*  */

app.use((err, req, res) => {
	res.status(err.status | 500);

	res.json({
		errors: {
			message: err.message,
			error: {}
		}
	})
});


app.listen(8000, () => console.log("server run on localhost:8000"))