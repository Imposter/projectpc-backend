import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import BasicIdResult from "../Models/Results/BasicIdResult";
import SessionData from "../Models/SessionData";
import DownloadImageResult from "../Models/Results/DownloadImageResult";
import { PostStatus, Posts, IPostModel } from "../Models/Post";
import { Images, IImageModel } from "../Models/Image";
import { JsonController, Get, Post, Delete, Authorized, Req, Session, BodyParam, InternalServerError, BadRequestError, HttpError } from "routing-controllers";
const sharp = require("sharp");

@JsonController("/post")
export default class PostController {
    private static MAX_IMAGES = 8;
    private static RESIZE_WIDTH = 240; // px

    @Authorized()
    @Post("/create")
    async create(@Session() session: any,
        @BodyParam("title") title: string, 
        @BodyParam("category") category: string,
        @BodyParam("tags", { required: false }) tags: string[], 
        @BodyParam("price") price: number,
        @BodyParam("currency") currency: string,
        @BodyParam("body") body: string) {
        // Create post
        var post = await Posts.create(<IPostModel> {
            authorId: session.data.userId,
            status: PostStatus.Unlisted,
            title: title,
            category: category,
            tags: tags,
            price: price,
            currency: currency,
            imageIds: [],
            thumbnailId: null,
            thumbnailIndex: -1,
            body: body
        });

        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: post._id.toString()
        })
    }

    @Authorized()
    @Post("/uploadImage")
    async uploadImage(@Session() session: any,
        @BodyParam("postId") postId: string,
        @BodyParam("thumbnail") thumbnail: boolean,
        @BodyParam("imageData") imageData: string) {
        // Check if post id is valid
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Check if upload limit reached
        if (post.imageIds.length >= PostController.MAX_IMAGES) {
            return new Result(ResultCode.ImageLimitReached);
        }

        // Insert image
        var image = await Images.create(<IImageModel> {
            postId: post._id.toString(),
            imageData: imageData
        });

        // Update post with new image id
        var index = post.imageIds.push(image._id.toString()) - 1;

        // Do we have to generate a thumbnail?
        if (thumbnail) {
            // Remove previous thumbnail if any
            if (post.thumbnailId != null) {
                await Images.findByIdAndRemove(post.thumbnailId);
            }

            // Decode image from base64
            var rawImageData = Buffer.from(imageData, "base64");

            // Resize buffer
            var rawThumbnailData = await sharp(rawImageData).resize(PostController.RESIZE_WIDTH, null).toBuffer();
            
            // Encode image to base64
            var thumbnailData = rawThumbnailData.toString("base64");

            // Insert thumbnail into database
            var thumbnailImage = await Images.create(<IImageModel> {
                postId: post._id.toString(),
                imageData: thumbnailData
            });

            // Update post with thumbnail id and index
            post.thumbnailId = thumbnailImage._id.toString();
            post.thumbnailIndex = index;
        }
        
        // Update post
        await post.save();

        // Send response
        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: image._id.toString()
        });
    }

    @Authorized()
    @Delete("/removeImage")
    async removeImage(@Session() session: any,
        @BodyParam("postId") postId: string,
        @BodyParam("index") index: number) {
        // Check if post id is valid
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Check if index is valid
        if (index >= post.imageIds.length) {
            return new Result(ResultCode.InvalidImageIndex);
        }

        // Remove image
        var image = await Images.findOneAndRemove(post.imageIds[index]);
        post.imageIds = post.imageIds.splice(index, 1);

        // Remove thumbnail
        if (index == post.thumbnailIndex) {
            await Images.findByIdAndRemove(post.thumbnailId);

            post.thumbnailId = null;
            post.thumbnailIndex = post.imageIds.length == 0 ? -1 : 0;
        }

        //  If any available image, set as thumbnail
        if (post.thumbnailIndex == 0 && post.thumbnailId == null) {
            // Find first image
            var firstImage = await Images.findById(post.imageIds[0]);
            var imageData = firstImage.imageData;

            // Decode image from base64
            var rawImageData = Buffer.from(imageData, "base64");
            
            // Resize buffer
            var rawThumbnailData = await sharp(rawImageData).resize(PostController.RESIZE_WIDTH, null).toBuffer();
            
            // Encode image to base64
            var thumbnailData = rawThumbnailData.toString("base64");

            // Insert thumbnail into database
            var thumbnailImage = await Images.create(<IImageModel> {
                postId: post._id.toString(),
                imageData: thumbnailData
            });

            // Update post with thumbnail id and index
            post.thumbnailId = thumbnailImage._id.toString();
            post.thumbnailIndex = 0;
        }
        
        // Update post
        await post.save();

        // Send response
        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: image._id.toString()
        });
    }

    @Authorized()
    @Post("/setThumbnailImage")
    async setThumbnailImage(@Session() session: any,
        @BodyParam("postId") postId: string,
        @BodyParam("index") index: number) {
        // Check if post id is valid
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Check if image index is valid
        if (index >= post.imageIds.length) {
            return new Result(ResultCode.InvalidImageIndex);
        }

        // Find image and get image data
        var image = await Images.findById(post.imageIds[index]);
        if (image == null) {
            return new Result(ResultCode.InternalError);
        }

        // Remove previous thumbnail if any
        if (post.thumbnailId != null) {
            await Images.findByIdAndRemove(post.thumbnailId);
        }

        // Decode image from base64
        var rawImageData = Buffer.from(image.imageData, "base64");

        // Resize buffer
        var rawThumbnailData = await sharp(rawImageData).resize(PostController.RESIZE_WIDTH, null).toBuffer();
            
        // Encode image to base64
        var thumbnailData = rawThumbnailData.toString("base64");

        // Insert thumbnail into database
        var thumbnail = await Images.create(<IImageModel> {
            postId: post._id.toString(),
            imageData: thumbnailData
        });

        // Update post with thumbnail id
        post.thumbnailId = thumbnail._id.toString();
        post.thumbnailIndex = index;
        
        // Update post
        await post.save();

        // Send response
        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: image._id.toString()
        });
    }

    @Authorized()
    @Post("/setListed")
    async setListed(@Session() session: any,
        @BodyParam("postId") postId: string) {
        var post = await Posts.findById(postId);
        if (post == null || post.authorId != (<SessionData>session.data).userId) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Update post
        post.status = PostStatus.Listed;
        await post.save();

        // Send response
        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: postId
        });
    }
    
    @Authorized()
    @Post("/update")
    async update(@Session() session: any,
        @BodyParam("postId") postId: string, 
        @BodyParam("title", { required: false }) title: string, 
        @BodyParam("category", { required: false }) category: string,
        @BodyParam("tags", { required: false }) tags: string[], 
        @BodyParam("price", { required: false }) price: number,
        @BodyParam("currency", { required: false }) currency: string,
        @BodyParam("body", { required: false }) body: string) {
        // Get post
        var post = await Posts.findById(postId);
        if (post == null) {
            return new Result(ResultCode.InvalidPostId);
        }

        // Update post
        if (title != null) post.title = title;
        if (category != null) post.category = category; // NOTE: We probably shouldn't allow modification of this, but oh well
        if (tags != null) post.tags = tags;
        if (price != null) post.price = price;
        if (currency != null) post.currency = currency;
        if (body != null) post.body = body;

        await post.save();

        return new Result(ResultCode.Ok, <BasicIdResult> {
            id: post._id.toString()
        })
    }

    @Authorized()
    @Post("/downloadImage")
    async downloadImage(@Session() session: any,
        @BodyParam("imageId") imageId: string) {
        // Find image and get image data
        var image = await Images.findById(imageId);
        if (image == null) {
            return new Result(ResultCode.InvalidImageId);
        }

        // Send response
        return new Result(ResultCode.Ok, <DownloadImageResult> {
            imageData: image.imageData
        });
    }
}