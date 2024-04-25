import logger from "../config/logger.mjs";
import {Token} from "../models/index.mjs";

export const scheduleTokenCleanup = () => {
    setInterval(async () => {
        try {
            await Token.deleteMany({expires: {$lt: new Date()}})
            logger.info('Expired tokens cleanup scheduled task complete.')
        } catch (error) {
            logger.error('Error running scheduled token cleanup task:', error)
        }
    }, 3600000); // 1 hour in milliseconds
};

