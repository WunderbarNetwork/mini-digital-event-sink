import AuthenticationType from "../types/AuthenticationType.js";

import { authenticationTypeAsyncHandler } from "../util/handler.js";
import { methodNotAllowedEvent, postEvent } from "../controllers/events.js";

import { Router } from "express";

const eventRoutes = Router();

eventRoutes.post("/events/jwt/v1/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.JWT));
eventRoutes.all("/events/jwt/v1/:id", methodNotAllowedEvent);

eventRoutes.post("/events/key/v1/:id", authenticationTypeAsyncHandler(postEvent, AuthenticationType.API_KEY));
eventRoutes.options("/events/key/v1/:id", methodNotAllowedEvent);

export default eventRoutes;
