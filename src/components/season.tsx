import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'urql'
import { BackdropCard } from '~/components/ui/backdrop-card'
import { Card } from '~/components/ui/card'
import { Div } from '~/components/ui/div'
import { EpisodeCard } from '~/components/ui/episode-card'
import { ErrorMsg } from '~/components/ui/error-msg'
import { CardGrid, EpisodeGrid, MediaGrid } from '~/components/ui/grid'
import { InputBar } from '~/components/ui/input-bar'
import { Loading } from '~/components/ui/loading'
import { Pager } from '~/components/ui/pager'
import { Taber } from '~/components/ui/taber'
import { seasonDoc } from '~/gql/season'
import { useSp } from '~/hooks/search-params'
import { useTimeout } from '~/hooks/timeout'
import { useTitle } from '~/hooks/title'
import { genMediaStr } from '~/util/media-str'
import { numGt0 } from '~/util/validation'

const tabs = [
  { key: 'Episodes', val: 'Episodes' },
  { key: 'Cast', val: 'Cast' },
  { key: 'Crew', val: 'Crew' },
  { key: 'Images', val: 'Images' },
  { key: 'Videos', val: 'Videos' },
]

export function SeasonPage() {
  const [sp, rplSp] = useSp({
    query: '',
    page: '1',
    tab: 'Episodes',

    id: '',
    season_number: '',
  })

  const pageInt = parseInt(sp.page)

  const setQuery = (query: string) => rplSp({ query, page: '1' })
  const setPage = (dir: number) => rplSp({ page: `${pageInt + dir}` })
  const setTab = (tab: string) => rplSp({ tab, page: '1' })

  const [db, setDb] = useState(sp.query)
  useTimeout(() => (db !== sp.query ? setQuery(db) : null), [db])

  const [res] = useQuery({
    query: seasonDoc,
    variables: {
      id: sp.id,
      season_number: sp.season_number,
      query: sp.query,
      page: pageInt,
    },
  })

  const { fetching, error } = res
  const show = res.data?.tv
  const season = res.data?.tvSeason

  function genSeasonShortHand() {
    let str = ''
    str += 'S'
    str += `${sp.season_number}`.padStart(2, '0')
    return str
  }

  function genTitle() {
    const content: string[] = []

    if (show?.name) content.push(show.name)
    content.push(genSeasonShortHand())

    return content.join(' | ')
  }

  function genPriText() {
    const content: string[] = []

    if (show?.name) content.push(show.name)
    if (sp.season_number) content.push(`Season ${sp.season_number}`)

    return content.join(' | ')
  }

  function genTerText() {
    const content: string[] = []

    if (season?.air_date) content.push(season.air_date)
    if (numGt0(season?.episodes?.length)) {
      content.push(`${season?.episodes?.length} Episodes`)
    }

    return content.join(' | ')
  }

  useTitle(genTitle())

  const showInputBar = ['Cast', 'Crew'].includes(sp.tab)
  const showPager = ['Cast', 'Crew', 'Images', 'Videos'].includes(sp.tab)

  if (error) return <ErrorMsg msg={error.message} />

  return (
    <div className='flex flex-col gap-2'>
      <BackdropCard
        bgImg={show?.backdrop_path}
        to={`/tv/${sp.id!}`}
        pri={genPriText()}
        sec={genTerText()}
      />

      <Taber tabs={tabs} activeTab={sp.tab} onTabClicked={setTab} />

      <Div value={fetching}>
        <Loading />
      </Div>

      {showInputBar && (
        <InputBar defaultValue={sp.query} onValueChange={(val) => setDb(val)} />
      )}

      {sp.tab === 'Episodes' && (
        <EpisodeGrid>
          {season?.episodes?.map((x) => (
            <Link
              href={`/tv/${sp.id}/season/${sp.season_number}/episode/${x.episode_number}`}
              key={x.id}
            >
              <EpisodeCard x={x} />
            </Link>
          ))}
        </EpisodeGrid>
      )}

      {sp.tab === 'Cast' && (
        <CardGrid>
          {season?.credits?.cast?.map((x) => {
            const sec = genMediaStr({
              pri: x?.character,
              rmVoice: true,
            })

            return (
              <Link href={`/person/${x.id}`} key={x.id}>
                <Card img={x.profile_path} pri={x.name} sec={sec} />
              </Link>
            )
          })}
        </CardGrid>
      )}

      {sp.tab === 'Crew' && (
        <CardGrid>
          {season?.credits?.crew?.map((x) => {
            const sec = genMediaStr({ pri: x?.job })

            return (
              <Link href={`/person/${x.id}`} key={x.id}>
                <Card img={x.profile_path} pri={x.name} sec={sec} />
              </Link>
            )
          })}
        </CardGrid>
      )}

      {sp.tab === 'Images' && (
        <MediaGrid variant='234' images={season?.images?.posters} />
      )}

      {sp.tab === 'Videos' && (
        <MediaGrid variant='234' videos={season?.videos?.results} />
      )}

      {showPager && (
        <Pager
          page={pageInt}
          pgUp={() => setPage(1)}
          pgDown={() => setPage(-1)}
        />
      )}
    </div>
  )
}
