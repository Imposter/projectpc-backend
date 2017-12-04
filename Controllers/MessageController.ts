import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import BasicIdResult from "../Models/Results/BasicIdResult";
import GetMessagesResult from "../Models/Results/GetMessagesResult";
import { ISession } from "../Models/Session";
import { Messages, IMessage } from "../Models/Message";
import { PostStatus, Posts, IPost } from "../Models/Post";
import { Users, IUser } from "../Models/User";
import { JsonController, Get, Post, Delete, Authorized, Req, Session, BodyParam, InternalServerError, BadRequestError, HttpError } from "routing-controllers";
import { Request } from "express";

@JsonController("/message")
export default class MessageController {
    @Authorized()
    @Post("/create")
    async create(@Session() session: ISession,
        @BodyParam("postId") postId: string,
        @BodyParam("targetId") targetId: string,
        @BodyParam("body") body: string) {
        // Check if post exists
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Check if target user exists
        var targetUser = await Users.findById(targetId);
        if (targetUser == null) {
            return new Result(ResultCode.InvalidUserId);
        }

        // Create message for target user
        var message = await Messages.create(<IMessage> {
            postId: postId,
            senderId: session.data.userId,
            targetId: targetId,
            body: body
        });

        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: message._id.toString()
        });
    }

    @Authorized()
    @Post("/getMessagesForPost")
    async getMessagesForPost(@Session() session: ISession,
        @BodyParam("postId") postId: string) {
        // Check if post exists
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Get messages for user
        var messages = await Messages.find({
            postId: postId,
            $or: [ { senderId: session.data.userId }, { targetId: session.data.userId } ]
        });

        return new Result(ResultCode.Ok, <GetMessagesResult> {
            messages: messages
        });
    }

    @Authorized()
    @Post("/getAllMessages")
    async getAllMessages(@Session() session: ISession) {
        // Get all messages which refer to user
        var messages = await Messages.find({
            $or: [ { senderId: session.data.userId }, { targetId: session.data.userId } ]
        }).lean();
        
        return new Result(ResultCode.Ok, <GetMessagesResult> {
            messages: messages
        });
    }

    // TODO: Add getMessagesSince method, which the app will use to send requests periodically to get new messages
}