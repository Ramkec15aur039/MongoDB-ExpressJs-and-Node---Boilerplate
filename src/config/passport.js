/*
    Passport.js
*/

/** ***************** Models Import ******************************************************** */
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./index');
const { tokenTypes } = require('./tokens');
const { User, Candidate } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    console.log('payload');
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'candidate')) {
      const candidate = await Candidate.findById(payload.sub).then((res) => {
        res.role = 'candidate';
        return res;
      });
      if (!candidate) {
        return done(null, false);
      }
      done(null, candidate);
    } else {
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    }
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
