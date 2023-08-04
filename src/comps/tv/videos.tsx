import { gql } from 'urql'
import { useTVQuery } from '~/comps/tv/query'
import { TVProps } from '~/comps/tv/z'
import { VideoCard } from '~/comps/video-card'
import { toDateString } from '~/util/local-date'

const gqlQuery = gql`
  query ($id: String!, $page: Int) {
    tv(id: $id, page: $page) {
      videos {
        results {
          key
          name
          published_at
        }
      }
    }
  }
`

export default function Videos(props: TVProps) {
  const { queries } = props
  const { id, page } = queries

  const [res] = useTVQuery(gqlQuery, { id, page })
  const videos = res.data?.tv?.videos?.results

  return (
    <>
      <div className='grid234 mb-2'>
        {videos?.map((x, i) => (
          <VideoCard
            href={`https://www.youtube.com/watch?v=${x.key}`}
            src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`}
            primary={x.name}
            secondary={toDateString(x.published_at)}
            key={i}
          />
        ))}
      </div>
    </>
  )
}
