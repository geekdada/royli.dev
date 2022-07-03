import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

const Comments = () => {
  const { theme } = useTheme()

  return (
    <Giscus
      id="comments"
      repo="geekdada/blog-discussions"
      repoId="R_kgDOGmDiOw="
      category="Announcements"
      categoryId="DIC_kwDOGmDiO84CAdRf"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="zh-CN"
      loading="lazy"
    />
  )
}

export default Comments
