import { Posts } from "src/database/models/posts.model";

export class PostDto {
    postId: Posts['postId']
    name: Posts['name']
    description: Posts['description']
    createdAt: Posts['createdAt']
    modifiedAt: Posts['modifiedAt']
    user: Pick<Posts['user'], "login" | "userId" | 'createdAt'>

    constructor(post: Posts){
        this.postId = post.postId
        this.name = post.name
        this.description = post.description
        this.createdAt = new Date(post.createdAt)
        this.modifiedAt = post.modifiedAt ? new Date(post.modifiedAt) : null
        this.user = {
            userId: post.user.userId,
            login: post.user.login,
            createdAt: new Date(post.user.createdAt)
        }
    }
}