import { NextApiRequest, NextApiResponse } from 'next'

type NextHandler = () => ValueOrPromise<any>
type ValueOrPromise<T> = T | Promise<T>

export type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => Promise<void>
