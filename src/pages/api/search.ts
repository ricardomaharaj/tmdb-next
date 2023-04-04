import { tmdbApi } from '@/util/tmdb-api'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { query, page } = req.query as Record<string, string>
  const x = await tmdbApi.search({ query, page })
  return res.json(x)
}

export default handler
