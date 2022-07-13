import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const Comments = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Giscus
      id="comments"
      repo="geekdada/blog-discussions"
      repoId="R_kgDOGmDiOw"
      category="Announcements"
      categoryId="DIC_kwDOGmDiO84CAdRf"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="zh-CN"
      loading="lazy"
    />
  )
}

export default Comments
