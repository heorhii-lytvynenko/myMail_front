import z from 'zod'

export const validators = {
  email: () => {
    return z.email('validation.emailInvalid')
  },

  password: () => {
    return z
      .string()
      .trim()
      .min(1, 'validation.passwordRequired')
      .min(8, 'validation.passwordMinLength')
      .regex(/[a-z]/, 'validation.passwordLowercaseRequired')
      .regex(/[A-Z]/, 'validation.passwordUppercaseRequired')
      .regex(/[0-9]/, 'validation.passwordNumberRequired')
      .regex(/[^a-zA-Z0-9]/, 'validation.passwordSpecialCharacterRequired')
  },

  fullName: () => {
    return z
      .string()
      .trim()
      .min(1, 'validation.fullNameRequired')
      .min(3, 'validation.fullNameMinLength')
      .max(100, 'validation.fullNameMaxLength')
  },

  headline: ({ required = true }: { required?: boolean } = {}) => {
    return z
      .string()
      .trim()
      .min(required ? 1 : 0, { message: 'validation.headlineRequired' })
      .refine((v) => !v || v.length >= 3, {
        message: 'validation.headlineMinLength'
      })
      .max(120, { message: 'validation.headlineMaxLength' })
      .optional()
      .transform((val) => val || undefined)
  },

  birthDate: ({ required = true }: { required?: boolean } = {}) => {
    return z
      .string()
      .trim()
      .min(required ? 1 : 0, { message: 'validation.birthDateRequired' })
      .refine(
        (val) => {
          if (!required && !val) return true

          return (
            /^\d{4}-\d{2}-\d{2}$/.test(val) && !Number.isNaN(Date.parse(val))
          )
        },
        { message: 'validation.birthDateInvalid' }
      )
      .optional()
      .transform((val) => val || undefined)
  },

  file: () => {
    return z.instanceof(File)
  },

  displayName: () => {
    return z
      .string()
      .trim()
      .min(1, 'validation.displayNameRequired')
      .min(3, 'validation.displayNameMinLength')
      .max(100, 'validation.displayNameMaxLength')
  },

  emailDomain: () => {
    return z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^(?!@)(?!.*@)[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
        'validation.emailDomainInvalid'
      )
      .refine((val) => val.split('.').at(-1)!.length >= 2, {
        message: 'validation.emailDomainInvalid'
      })
      .optional()
      .transform((val) => val || undefined)
  },

  website: () => {
    return z
      .string()
      .trim()
      .refine(
        (val) => {
          if (!val) return true

          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(
            val
          )
        },
        { message: 'validation.websiteInvalid' }
      )
      .optional()
      .transform((val) => val || undefined)
  }
}
