var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var clientesRouter = require('./routes/clientes');
var vendedoresRouter = require('./routes/vendedores');
var pecasRouter = require('./routes/pecas');
var carrinhoRouter = require('./routes/carrinhos');
var itemCarrinhoRouter = require('./routes/itemcarrinho');
var pedidoRouter = require('./routes/pedidos');
var buscaPecaRouter =  require('./routes/buscapeca');

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
app.use('/carrinhos', carrinhoRouter);
app.use('/itemcarrinho', itemCarrinhoRouter);
app.use('/pedidos', pedidoRouter);
app.use('/buscapeca', buscaPecaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
