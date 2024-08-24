export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishDate: string
  lastEditDate: string
  isFeatured: boolean
  isGallaryView: boolean
  readURL: string
  coverImage: string | null
  coverIcon: string | null
  tags: Tag[] | null
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
}
