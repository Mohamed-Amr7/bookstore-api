import express from "express"
import authRoute from "./auth.route.mjs"
import bookRoute from "./book.route.mjs"
import userRoute from "./user.route.mjs"
import profileRoute from "./profile.route.mjs"
import cartRoute from "./cart.route.mjs"
import orderRoute from "./order.route.mjs"

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
      path: '/profile',
      route: profileRoute
    },
    {
        path: '/cart',
        route: cartRoute
    },
    {
        path: '/orders',
        route: orderRoute
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router