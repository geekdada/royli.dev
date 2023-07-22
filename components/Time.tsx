import React from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

const Time = ({ datetime, format }: { datetime: string; format?: string }) => {
  return <span>{dayjs(datetime).format(format || 'MMM D, YYYY h:mm A')}</span>
}

export default Time
