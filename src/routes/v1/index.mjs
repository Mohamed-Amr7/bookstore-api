import express from "express";
import authRoute from "./auth.route.mjs";
import bookRoute from "./book.route.mjs";

const router = express.Router();

const routes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/books',
        route: bookRoute
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router