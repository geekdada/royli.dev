import type { MDXComponents } from 'mdx/types'
import {
  Callout,
  Details,
  Video,
  Embed,
  LinkPreview,
  TableOfContents,
} from '@/components/mdx'
import { MDXImage } from '@/components/mdx/MDXImage'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    Details,
    Video,
    Embed,
    LinkPreview,
    TableOfContents,
    MDXImage,
    img: (props) => <MDXImage src={props.src ?? ''} alt={props.alt} />,
    ...components,
  }
}
