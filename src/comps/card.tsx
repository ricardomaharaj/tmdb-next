import { imageUrls } from '@/consts'
import Link from 'next/link'
import { UrlObject } from 'url'

export type CardVariant = 'tv' | 'movie' | 'person'

interface Props {
  img?: string
  primary?: string
  secondary?: string
  tertiary?: string
  variant?: CardVariant
  href: UrlObject | string
}
export default function Card(props: Props) {
  const { img, primary, secondary, tertiary, href, variant } = props

  let icon = 'bi-question'
  if (variant === 'tv') icon = 'bi-tv'
  if (variant === 'movie') icon = 'bi-film'
  if (variant === 'person') icon = 'bi-person'

  return (
    <Link href={href} className='row'>
      <div className='col mr-2'>
        {img ? (
          <img
            src={`${imageUrls.w94h141}${img}`}
            className='max-h-[141px] max-w-[94px]'
            height={141}
            width={94}
            alt=''
          />
        ) : (
          <div className='col h-[141px] w-[94px] justify-center bg-black'>
            <div className='row justify-center'>
              <i className={`bi ${icon} text-6xl text-white`} />
            </div>
          </div>
        )}
      </div>
      <div className='col'>
        {secondary && <div className=''>{secondary}</div>}
        {primary && <div className=''>{primary}</div>}
        {tertiary && <div className=''>{tertiary}</div>}
      </div>
    </Link>
  )
}
