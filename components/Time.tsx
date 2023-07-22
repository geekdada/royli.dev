import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

const Time = ({ datetime, format }: { datetime: string; format?: string }) => {
  const [formattedDateTime, setFormattedDateTime] = useState<null | string>(
    null
  )

  useEffect(() => {
    if (formattedDateTime === null) {
      setFormattedDateTime(dayjs(datetime).format(format || 'lll'))
    }
  }, [formattedDateTime, datetime, format])

  return formattedDateTime ? (
    <time dateTime={datetime}>{formattedDateTime}</time>
  ) : (
    <time dateTime={datetime}>{datetime}</time>
  )
}

export default Time
