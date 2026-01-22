interface ArticleContentProps {
  children: React.ReactNode
}

export default function ArticleContent({ children }: ArticleContentProps) {
  return (
    <div className="my-6 prose prose-gray dark:prose-invert max-w-none">
      {children}
    </div>
  )
}
