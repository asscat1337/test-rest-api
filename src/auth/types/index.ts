export type UserLoginResponse = {
  userId: string;
  refreshToken: string;
  accessToken: string;
};

export type UserRegisterResponse = {
  login: string;
  userId: string;
  createdAt: Date;
};
