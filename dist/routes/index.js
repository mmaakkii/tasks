"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("@auth/routes");
const routes_2 = require("@organization/routes");
const routes_3 = require("@tasks/routes");
const baseRouter = express_1.Router();
baseRouter.use('/v1/users', routes_1.userRoutes);
baseRouter.use('/v1/tasks', routes_3.taskRoutes);
baseRouter.use('/v1/organizations', routes_2.organizationRoutes);
exports.default = baseRouter;
