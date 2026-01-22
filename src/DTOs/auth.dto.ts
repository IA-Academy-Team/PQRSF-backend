export type AuthRegisterDTO = {
  name?: string;
  email: string;
  password: string;
};

export type AuthLoginDTO = {
  email: string;
  password: string;
};

export type AuthRequestResetDTO = {
  email: string;
  redirectTo?: string;
};

export type AuthResetDTO = {
  token: string;
  newPassword: string;
};
