export type PostsSearchParams = {
  postId?: string;
  name?: string;
  skip?: number;
  limit?: number;
  "user.userId"?: string
  "user.login"?: string
  sortOrder?: 'ASC' | 'DESC';
  sortField?: string;
};

export type PostResponse = {
    postId: string,
    name: string,
    description: string,
    createdAt: Date,
    modifiedAt: Date | null,
    user: {
        userId: string,
        login: string,
        createdAt: Date
    }
}