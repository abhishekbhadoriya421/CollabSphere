import express from "express";
import { GetMessageByChannelIdAction, CreateNewMessageAction, GetPageOffsetAction, SaveUserReactionAction, DeleteUserMassage } from "../controller/ChatController";
import { ValidateAccessToken, ValidateRefreshToken } from '../middleware/ValidateAccessTokenMiddleware';
const Router = express.Router();

Router.get('/message/:channelId', ValidateAccessToken, GetMessageByChannelIdAction);
Router.get('/get-message-offset', ValidateAccessToken, GetPageOffsetAction);


Router.post('/save-new-message', ValidateRefreshToken, CreateNewMessageAction);
Router.post('/save-user-reaction', ValidateRefreshToken, SaveUserReactionAction);
Router.post('/delete-message', ValidateRefreshToken, DeleteUserMassage);
export default Router;
