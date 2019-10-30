const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// three Amigos
function dateLogger(req, res, next){
console.log(new Date().toISOString());

  next();
}

function logger(req,res,next){
console.log(`[${new Date().toISOString()}]${req.method} to ${req.url}`);

  next();
}

//* change the gatekeeper to return a 400 if no password is provided and a message that says please proved a password
//* if a password is provided and it is mellon,call next, otherwise return a 401
//* and the "you: shall not pass"
function gateKeeper(req,res,next){
  // data can come in through the body, url, parameters, query string, 
  //new way of reading data sent by client
  const password = req.headers.password;
  if(password.toLowerCase() ==='melon') {
    next();
  } else{
    res.status(400).json({you:'cannot pass!!'});
  }
}
//Global Middleware
server.use(helmet()); //third-party
server.use(gateKeeper);
server.use(express.json()); /// Built-in
server.use(dateLogger); //custom middleware
server.use(morgan('dev'));
server.use('/api/hubs', hubsRouter);


server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
