import express from "express";
import { GetMessageByChannelIdAction, CreateNewMessageAction,GetPageOffsetAction } from "../controller/ChatController";
import { ValidateAccessToken, ValidateRefreshToken } from '../middleware/ValidateAccessTokenMiddleware';
const Router = express.Router();

Router.get('/message/:channelId', ValidateAccessToken, GetMessageByChannelIdAction);
Router.get('/get-message-offset',ValidateAccessToken,GetPageOffsetAction);


Router.post('/save-new-message', ValidateRefreshToken, CreateNewMessageAction);


export default Router;
