import Card from '@/comps/card'
import { SearchResults } from '@/types/search-results'
import { trimmer } from '@/util'
import { api } from '@/util/local-api'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const router = useRouter()

  const query = (router.query.query as string) || ''
  const page = parseInt(router.query.page as string) || 1

  const { data: results } = useSearch({ query, page })

  function updateQueries(update: any) {
    router.replace({ query: { query, page, ...update } })
  }

  const [debounce, setDebounce] = useState(query)
  const ref = useRef<NodeJS.Timeout>()
  useEffect(() => {
    ref.current = setTimeout(() => {
      updateQueries({ query: debounce })
    }, 500)
    return () => clearTimeout(ref.current)
  }, [debounce])

  return (
    <>
      <div className='row'>
        <input
          type='text'
          placeholder='SEARCH'
          defaultValue={query}
          className='w-full border-2 p-2 text-center outline-none'
          onChange={(e) => setDebounce(e.target.value)}
        />
      </div>
      <div className='grid123'>
        {results?.results?.map(
          ({
            poster_path,
            profile_path,
            title,
            name,
            release_date,
            first_air_date,
            media_type,
            overview,
            id,
          }) => (
            <Card
              img={poster_path || profile_path}
              primary={title || name}
              secondary={query && (release_date || first_air_date)}
              tertiary={overview && trimmer(overview)}
              path={`${media_type}/${id}`}
              key={`${media_type}/${id}`}
            />
          )
        )}
      </div>
      {query && (
        <div className='row justify-evenly py-2'>
          <button
            className='px-4'
            onClick={() => updateQueries({ page: page - 1 })}
          >
            {'<'}
          </button>
          <div>{page}</div>
          <button
            className='px-4'
            onClick={() => updateQueries({ page: page + 1 })}
          >
            {'>'}
          </button>
        </div>
      )}
    </>
  )
}

function useSearch(args: { query: string; page: number }) {
  const { query, page } = args

  const [data, setData] = useState<SearchResults>()

  useEffect(() => {
    api
      .get<SearchResults>('search', { query, page })
      .then((res) => setData(res))
      .catch((e) => console.log(e))
  }, [query, page])

  return { data }
}
