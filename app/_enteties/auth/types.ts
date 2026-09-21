export interface LoginBody {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface RegisterBody {
  displayName: string
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
}

export interface ResetPasswordBody {
  email: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface NewPasswordBody {
  token: string
  newPassword: string
}

export interface NewPasswordResponse {
  message: string
}
