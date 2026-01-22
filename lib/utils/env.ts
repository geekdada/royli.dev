export const getEnv = (
  key: string,
  defaultValue: string = '',
  env = process.env
): string => {
  const value = env[key]

  if (value !== undefined) {
    return value
  }

  return defaultValue
}
