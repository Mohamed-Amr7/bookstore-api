import express from "express";
import authRoute from "./auth.route.mjs";

export const router = express.Router();

const routes = [
    {
        path: '/auth',
        route: authRoute,
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

