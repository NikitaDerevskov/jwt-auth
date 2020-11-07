const express = require('express');
const path = require('path');
const bodyParse = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorHandler');

const app = express();


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