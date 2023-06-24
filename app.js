var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var clientesRouter = require('./routes/clientes');
var vendedoresRouter = require('./routes/vendedores');
var pecasRouter = require('./routes/pecas');
var loginRouter =  require('./routes/login');
var comprasRouter = require('./routes/compras')
 var adminRouter = require('./routes/admin')

var app = express();

// CORS
app.use(cors({origin:'http://localhost:3000'}));
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/clientes', clientesRouter);
app.use('/vendedores', vendedoresRouter);
app.use('/pecas', pecasRouter);
app.use('/login', loginRouter);
app.use('/compras', comprasRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


module.exports = app;
