import express from "express";
import authRoute from "./auth.route.mjs";
import bookRoute from "./book.route.mjs";
import userRoute from "./user.route.mjs";
import cartRoute from "./cart.route.mjs";

const router = express.Router();

const routes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/books',
        route: bookRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/cart',
        route: cartRoute
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router