const express = require('express');
const app = express();
require('./logger.js')(app);

// Mount middlewares
require('./middleware')(app);
require('./routes')(app);

app.get('/', (req, res) => res.send('ok'));
app.get('/favicon.ico', (req, res) => res.status(204));
app.use((req, res) => {
  res.status(404).send({ url: req.url, msg: '404 Not Found' });
});

/* function basicAuth(req,res,next){
  const auth = {login: 'ul', password: '2020'}; // change this
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next();
  }
  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  return res.status(401).send('<head> <title>401 Unauthorized</title> </head><body> <h1>Unauthorized</h1> <p>This server could not verify that you are authorized to access the document requested. Either you supplied the wrong credentials (e.g., bad password), or your browser doesn\'t understand how to supply the credentials required.</p> </body></html>'); // custom message
}
app.use('/95deb5011a8fe1ccf6552234dhfda2ff0',basicAuth, express.static('logs')); */
process.on('unhandledRejection', (reason) => {
  throw reason;
});

module.exports = app;
