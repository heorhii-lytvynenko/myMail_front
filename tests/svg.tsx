import type { SVGProps } from 'react'

// Vitest renders the real shared UI; Next.js handles SVG asset compilation.
export default function SvgAsset(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} />
}
