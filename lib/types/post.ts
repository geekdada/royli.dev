export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  publishDate: string
  lastEditDate: string
  isFeatured: boolean
  readURL: string
  coverImage: string | null
  coverIcon: string | null
}

export interface Page {
  id: string
  title: string
  slug: string
  excerpt: string | null
  lastEditDate: string
  createdDate: string
  readURL: string
  coverImage: string | null
  coverIcon: string | null
}
