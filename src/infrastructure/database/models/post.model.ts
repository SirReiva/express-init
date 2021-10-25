import { model, Schema, Types } from 'mongoose';

interface Post {
	author?: Types.ObjectId;
	title: string;
	content: string;
}

const PostModel = model<Post>(
	'Post',
	new Schema<Post>({
		author: { type: 'ObjectId', ref: 'User' },
		title: { required: true, type: String },
		content: { required: true, type: String },
	})
);

export default PostModel;
