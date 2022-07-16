import { Magic } from 'magic-sdk'

// Create client-side Magic instance
const createMagic = (key: string) => {
  return typeof window != 'undefined' && new Magic(key, {})
}

const magic = createMagic(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string
)

export default magic
