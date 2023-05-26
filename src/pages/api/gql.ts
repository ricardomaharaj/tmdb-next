import { readFileSync } from 'fs'
import { createSchema, createYoga } from 'graphql-yoga'
import { ID } from '~/types/id'
import { Yoga } from '~/types/yoga'
import { TMDB } from '~/util/tmdb-api'

const schema = createSchema<Yoga>({
  typeDefs: readFileSync('./gql/schema.gql').toString('utf-8'),
  resolvers: {
    Query: {
      search: async (_, { query, page }: { query?: string; page: number }) => {
        if (!query) return await TMDB.trending()
        return await TMDB.search({ query, page })
      },
      movie: async (
        _,
        { id, query = '', page = 1 }: { id: ID; query?: string; page?: number },
      ) => {
        const movie = await TMDB.movie({ id })

        const perPage = 9
        const start = (page - 1) * perPage
        const end = page * perPage

        if (movie?.credits?.cast) {
          let cast = movie.credits.cast
          if (query) {
            cast = cast.filter((x) =>
              JSON.stringify(x).toLowerCase().includes(query),
            )
          }
          cast = cast.slice(start, end)
          movie.credits.cast = cast
        }

        if (movie?.credits?.crew) {
          let crew = movie?.credits?.crew
          if (query) {
            crew = crew.filter((x) =>
              JSON.stringify(x).toLowerCase().includes(query),
            )
          }
          crew = crew.slice(start, end)
          movie.credits.crew = crew
        }

        return movie
      },
      tv: async (_, { id }: { id: ID }) => {
        return await TMDB.tv({ id })
      },
      season: async (
        _,
        { id, season_number }: { id: ID; season_number: number },
      ) => {
        return await TMDB.season({ id, season_number })
      },
      episode: async (
        _,
        {
          id,
          season_number,
          episode_number,
        }: { id: ID; season_number: number; episode_number: number },
      ) => {
        return await TMDB.episode({ id, season_number, episode_number })
      },
    },
  },
})

const yoga = createYoga<Yoga>({ schema, graphqlEndpoint: '/api/gql' })

export default yoga
