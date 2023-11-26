import Redis from 'ioredis'

import { redisURL } from '@/lib/config'

const redis = new Redis(redisURL)

export default redis
