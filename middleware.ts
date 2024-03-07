import appConfig from '@/app/config'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from './auth'

export const middleware = async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (appConfig.USE_AUTH) {
    return await auth(req, res)
  }

  return
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
