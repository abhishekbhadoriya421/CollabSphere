import express from "express";
import { GetMessageByChannelIdAction } from "../controller/ChatController";
const Router = express.Router();

Router.get('/message/:channelId', GetMessageByChannelIdAction);

export default Router;
