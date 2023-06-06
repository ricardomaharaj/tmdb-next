import { gql, useQuery } from 'urql'
import { Card } from '~/comps/card'
import { ID } from '~/types/id'
import { TV } from '~/types/tmdb'
import { Queries } from './types'

const query = gql`
  query ($id: ID!, $query: String, $page: Int) {
    tv(id: $id, query: $query, page: $page) {
      aggregate_credits {
        crew {
          id
          name
          profile_path
          jobs {
            episode_count
            job
          }
        }
      }
    }
  }
`

type Data = { tv?: TV }
type Vars = {
  id: ID
  query: string
  page: number
}
function useCrewQuery(variables: Vars) {
  return useQuery<Data, Vars>({ query, variables })
}

type Props = { queries: Queries }
export default function Crew(props: Props) {
  const { queries } = props
  const { id, query, page } = queries

  const [res] = useCrewQuery({ id, query, page })
  const crew = res.data?.tv?.aggregate_credits?.crew

  return (
    <>
      <div className='col mb-2 space-y-2'>
        {crew?.map((x, i) => (
          <Card
            image={x.profile_path}
            href={`/person/${x.id}`}
            primary={x.name}
            secondary={x.jobs
              ?.slice(0, 2)
              ?.map((x) => `${x.job} (${x.episode_count})`)
              ?.join(' | ')}
            key={i}
          />
        ))}
      </div>
    </>
  )
}
