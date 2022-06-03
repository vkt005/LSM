const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');



module.exports = function(app) {
  app.set('trust proxy',true); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc

  const logFormat = (process.env.NODE_ENV !== 'production') ? ':method :url :status :res[content-length]  :remote-addr -  :response-time ms' : 'combined';

  app.use(morgan(logFormat, {
    skip: function (req, res) { 
      // Not log if status code 304
      if(res.statusCode == 304){
        return true;
      }
      // not log if user agent is cron this is for all cron jobs
      if(req.header('user-agent')){
        if(req.header('user-agent').includes('curl')){
          return true;
        }
      }
      // only log if user agent match (This is optional for testing purpose only)
      if(process.env.LOG_USER_AGENT){
        return (req.header('user-agent').indexOf(process.env.LOG_USER_AGENT) == -1) ? true : false;
      }
      return false;
    }
  }));
  app.use(cors());
  /*const limiter = rateLimit({
        windowMs: 1000, // 1 second
        max: 5 // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);*/

  // app.use((req, res, next) => {
  //     res.append('DateTime', new Date);
  //     next();
  // });

  // Confuse the Hackers
  app.use(helmet());
  app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({ extended: false,limit:'10mb' }));
    
};
