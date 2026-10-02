import ms from 'ms'

export const sec = (time: ms.StringValue) => {
  return Math.ceil(ms(time) / 1000)
}
