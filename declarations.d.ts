declare module '*.svg?react' {
  import type { SVGProps } from 'react'

  const Component: (props: SVGProps<SVGSVGElement>) => JSX.Element
  export default Component
}

declare module '*.svg' {
  const src: string
  export default src
}
