export const _guestRoutes = {
  login: '/login',
  register: '/register',

  verifyEmail: '/verify-email',
  verifyEmailExpired: '/verify-email/expired',
  verifyEmailResend: '/verify-email/resend',
  verifyEmailSuccess: '/verify-email/success',

  resetPassword: '/reset-password',
  resetPasswordCheckEmail: '/reset-password/check-email',
  resetPasswordNewPassword: '/reset-password/new-password',
  resetPasswordExpired: '/reset-password/expired',
  resetPasswordSuccess: '/reset-password/success'
} as const

export const _dynamicGuestRoutes = {
  verifyEmail: (email: string) => {
    return `${_guestRoutes.verifyEmail}?email=${encodeURIComponent(email)}` as const
  },

  resetPasswordNewPassword: (token: string) => {
    return `${_guestRoutes.resetPasswordNewPassword}?token=${encodeURIComponent(token)}` as const
  }
} as const
