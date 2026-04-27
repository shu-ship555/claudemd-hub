import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={28}
          height={28}
        >
          <path
            d="M12 2L20.5 6.8V17.2L12 22L3.5 17.2V6.8L12 2Z"
            stroke="#1a4fd6"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="8" y1="9.5" x2="16" y2="9.5" stroke="#1a4fd6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="12" x2="13" y2="12" stroke="#1a4fd6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="14.5" x2="15" y2="14.5" stroke="#1a4fd6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
