export interface PaginatedRequest {
  startCursor?: string
  pageSize: number
}

export interface PaginatedResponse<T> {
  results: T[]
  hasMore: boolean
  next_cursor: string | null
}
