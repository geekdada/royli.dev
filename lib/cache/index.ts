import KeyvRedis from '@keyv/redis'
import Keyv from 'keyv'

import redis from './redis'

export * from './constants'

const keyvRedis = new KeyvRedis(redis)

export const createCache = (namespace: string) =>
  new Keyv({ store: keyvRedis, namespace })

export const createCacheLayer = <
  Fetcher extends (...args: any[]) => Promise<any>,
  FetcherParams extends Parameters<Fetcher>,
  FetcherResponse extends Awaited<ReturnType<Fetcher>>
>(
  namespace: string,
  dataFetcher: Fetcher,
  ttl?: number
) => {
  const cache = createCache(namespace)

  async function request(...args: FetcherParams): Promise<FetcherResponse> {
    const key = JSON.stringify(args)
    const cached = await cache.get(key)

    if (cached) {
      return JSON.parse(cached) as FetcherResponse
    }

    const result = await dataFetcher(...args)

    await cache.set(key, JSON.stringify(result), ttl)

    return result
  }

  request.clear = async () => {
    await cache.clear()
  }

  request.delete = async (keyOrKeys: string | string[]) => {
    await cache.delete(keyOrKeys)
  }

  return request
}
