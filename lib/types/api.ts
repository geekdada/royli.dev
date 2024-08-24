export interface PaginatedRequest {
  startCursor?: string
  pageSize: number
  options?: {
    tagId?: string
  }
}

export interface PaginatedResponse<T> {
  results: T[]
  hasMore: boolean
  next_cursor: string | null
}
