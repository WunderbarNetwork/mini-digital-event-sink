import { authenticationTypeHandler, authenticationTypeAsyncHandler } from "../util/handler.js";
import AuthenticationType from "../types/AuthenticationType.js";
import { methodNotAllowedEvent, postEvent } from "../controllers/events.js";

import express from "express";

const eventRoutes = express.Router();

eventRoutes.post("/events/jwt/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.JWT));
eventRoutes.all("/events/jwt/:id", authenticationTypeHandler(methodNotAllowedEvent, AuthenticationType.JWT));

eventRoutes.post("/events/key/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.API_KEY));
eventRoutes.options("/events/key/:id", authenticationTypeHandler(methodNotAllowedEvent, AuthenticationType.API_KEY));

export default eventRoutes;
