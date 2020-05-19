require('dotenv').config();
const express = require('express');
const app = new express();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const parser = require('body-parser');
const knex = require('knex');
const knexDb = knex({ client: 'pg', connection: 'postgres://localhost/jwt_test' });
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const db = bookshelf(knexDb);
db.plugin(securePassword);
const jwt = require('jsonwebtoken');

const User = db.Model.extend({
  tableName: 'login_user',
  hasSecurePassword: true
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "12132232";

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //Your logic here
    })
  );
}; ``

const strategy = new JwtStrategy(opts, (payload, next) => {
  User.forge({ id: payload.id }).fetch().then(res => {
    next(null, res);
  });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(parser.urlencoded({
  extended: false
}));
app.use(parser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/seedUser', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('no fields');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    res.send('ok');
  });
});

app.post('/getToken', (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(401).send('no fields');
    }
    User.forge({ email: req.body.email }).fetch().then(result => {
      if (!result) {
        return res.status(400).send('user not found');
      }

      result.authenticate(req.body.password).then(user => {
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
        res.send(token);
      }).catch(err => {
        return res.status(401).send({ err });
      });
    });
  }
);

app.get('/Protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('i\'m protected');
});

app.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);