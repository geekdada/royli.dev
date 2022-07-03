import Redis from 'ioredis'

import { redisURL } from '../config'

const redis = new Redis(redisURL)

export default redis
