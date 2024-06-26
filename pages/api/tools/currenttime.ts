import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'
import { createEdgeRouter } from 'next-connect'
import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

extend(utc)
extend(timezone)

const router = createEdgeRouter<NextRequest, NextFetchEvent>()

export const config = {
  runtime: 'edge',
}

router.get(async () => {
  const date = new Date()
  const berlinTime = dayjs(date)
    .tz('Europe/Berlin')
    .format('YYYY-MM-DD HH:mm:ss')
  const beijingTime = dayjs(date)
    .tz('Asia/Shanghai')
    .format('YYYY-MM-DD HH:mm:ss')
  const newYorkTime = dayjs(date)
    .tz('America/New_York')
    .format('YYYY-MM-DD HH:mm:ss')
  const sfoTime = dayjs(date)
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DD HH:mm:ss')

  return NextResponse.json({
    local_time: {
      time: berlinTime,
      location: 'Berlin, Germany',
    },
    reference_time: [
      {
        time: beijingTime,
        location: 'Beijing, China',
      },
      {
        time: newYorkTime,
        location: 'New York, USA',
      },
      {
        time: sfoTime,
        location: 'San Francisco, USA',
      },
    ],
  })
})

export default router.handler({
  onError: (err) => {
    console.error(err)

    if (err instanceof Error) {
      return new NextResponse(err.message, {
        status: 500,
      })
    }
  },
})
