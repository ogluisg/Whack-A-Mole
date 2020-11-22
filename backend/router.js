import express from "express";
import config from './config/config.js';
import { signup, login, test, userDetails, verifyUser } from './api/controllers/UserController.js';
import { updateScore, getTop5, getUserTopScore } from './api/controllers/ScoreController.js'
import validateRequest from './api/middleware/validateRequest.js';
import { signupSchema, loginSchema, updateSchema } from './api/validation/userModel.js';
import authenticate from './api/middleware/auth.js';

const router = express.Router();
const endpoints = config.api.endpoints;

// load all endpoints
const routes = [
    { ...endpoints.main.test, action: test },
    { ...endpoints.main.user, action: userDetails } ,
    { ...endpoints.main.signup, action: signup, middleware: [validateRequest(signupSchema)] },
    { ...endpoints.main.login, action: login, middleware: [validateRequest(loginSchema)] },
    { ...endpoints.main.scoreboard, action: getTop5, middleware: [authenticate]},
    { ...endpoints.main.updateScore, action: updateScore, middleware: [authenticate, validateRequest(updateSchema) ]},
    { ...endpoints.main.getUserTopScore, action: getUserTopScore, middleware: [authenticate]},
    { ...endpoints.main.verify, action: verifyUser }
];

// bootstrap all routes
for (let route of routes) {
    let middleware = route.middleware || [];
    router[route.method](route.path, ...middleware, route.action);
}

export default router;
