import ms from 'ms'

export const sec = (time: string) => {
  return Math.ceil(ms(time) / 1000)
}
