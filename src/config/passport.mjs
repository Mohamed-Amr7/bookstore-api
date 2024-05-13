import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt'
import config from "./config.mjs";
import {User} from "../models/index.mjs";
import {TOKEN_TYPES} from "../constants/index.mjs";

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== TOKEN_TYPES.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
