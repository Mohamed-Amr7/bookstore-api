import passport from "passport";
import ApiError from "../utils/ApiError.mjs";
import httpStatus from "http-status";

export const isLoggedIn = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
        }

        req.user = user;
        next();
    })(req, res, next);
};
