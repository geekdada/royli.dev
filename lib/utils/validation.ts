import { z } from 'zod'

export function validateWithZod<T extends z.ZodType>(schema: T) {
  return (values: unknown) => {
    const result = schema.safeParse(values)
    if (result.success) return {}
    const errors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const path = issue.path.join('.')
      if (!errors[path]) {
        errors[path] = issue.message
      }
    }
    return errors
  }
}
