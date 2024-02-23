import { gql } from 'urql'
import { Search } from '~/types/tmdb'

type Data = {
  search: Search
}

type Vars = {
  query?: string
  page?: number
}

export const searchDoc = gql<Data, Vars>`
  query ($query: String, $page: Int) {
    search(query: $query, page: $page) {
      results {
        first_air_date
        id
        media_type
        name
        overview
        poster_path
        profile_path
        release_date
        title
      }
    }
  }
`