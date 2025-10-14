import express from "express";
import { GetMessageByChannelIdAction, CreateNewMessageAction } from "../controller/ChatController";
const Router = express.Router();

Router.get('/message/:channelId', GetMessageByChannelIdAction);
Router.post('/save-new-message', CreateNewMessageAction);

export default Router;
