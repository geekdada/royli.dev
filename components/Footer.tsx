import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()

  return (
    <footer
      className="primary-text p-6 text-center text-xs"
      onDoubleClick={() => router.push('/admin')}
    >
      Roy Li © {new Date().getFullYear()}
    </footer>
  )
}

export default Footer
