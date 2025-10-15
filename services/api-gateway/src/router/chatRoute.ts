import express from "express";
import { GetMessageByChannelIdAction, CreateNewMessageAction } from "../controller/ChatController";
import { ValidateAccessToken, ValidateRefreshToken } from '../middleware/ValidateAccessTokenMiddleware';
const Router = express.Router();

Router.get('/message/:channelId', ValidateAccessToken, GetMessageByChannelIdAction);
Router.post('/save-new-message', ValidateRefreshToken, CreateNewMessageAction);

export default Router;
