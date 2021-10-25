import { User } from './user.model';

export interface Post {
	author: string;
	title: string;
	content: string;
}

export interface PostWithAuthor extends Omit<Post, 'author'> {
	author: User;
}
