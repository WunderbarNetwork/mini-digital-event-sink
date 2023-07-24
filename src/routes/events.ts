import { authenticationTypeHandler, authenticationTypeAsyncHandler } from "../util/handler.js";
import AuthenticationType from "../types/AuthenticationType.js";
import { methodNotAllowedEvent, postEvent } from "../controllers/events.js";

import express from "express";

const eventRoutes = express.Router();

eventRoutes.post("/events/jwt/v1/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.JWT));
eventRoutes.all("/events/jwt/v1/:id", authenticationTypeHandler(methodNotAllowedEvent, AuthenticationType.JWT));

eventRoutes.post("/events/key/v1/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.API_KEY));
eventRoutes.options("/events/key/v1/:id", authenticationTypeHandler(methodNotAllowedEvent, AuthenticationType.API_KEY));

export default eventRoutes;
