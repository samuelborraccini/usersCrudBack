type User = {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type userRequest = {
  username: string;
  password: string;
};

export { User, userRequest };
