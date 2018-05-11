import express from 'express';
import { router } from './controllers';
import bodyParser from 'body-parser'; 
import passport from 'passport';
import { Strategy } from 'passport-twitter';
import session from 'express-session';
import keys from './config';


const app: express.Application = express();
const port: number = (process.env.PORT !== undefined) ? parseInt(process.env.PORT): 3005;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
    next();
});
passport.use(new Strategy({
  consumerKey: keys.consumer_key,
  consumerSecret: keys.consumer_secret,
  callbackURL: "http://localhost/3005/logged"
}, (token, tokenSecret, profile, done) => {
  console.log('logged', token);
}))
app.use(session({ secret: 'cats', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', router);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});