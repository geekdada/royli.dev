declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType
  export default MDXComponent
  export const metadata: Record<string, unknown>
}
