import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-6xl font-bold heading-text">404</h1>
      <p className="mt-4 text-xl">Page Not Found</p>
      <Link href="/" className="mt-8 hover-links">
        Go back home
      </Link>
    </div>
  )
}
