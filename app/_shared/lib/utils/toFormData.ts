import { isType } from './isType'

const appendValue = (formData: FormData, key: string, value: unknown): void => {
  if (isType.nil(value)) return

  if (isType.fileOrBlob(value)) {
    formData.append(key, value)
  } else if (isType.array(value)) {
    value.forEach((item, index) => {
      appendValue(formData, `${key}[${index}]`, item)
    })
  } else if (isType.object(value)) {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      appendValue(formData, `${key}[${nestedKey}]`, nestedValue)
    })
  } else {
    formData.append(key, String(value))
  }
}

export const toFormData = <T extends object>(data: T): FormData => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    appendValue(formData, String(key), value)
  })

  return formData
}
