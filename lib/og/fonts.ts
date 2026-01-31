import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

let cachedFont: Buffer | null = null

export async function getNotoSansSCBold(): Promise<Buffer> {
  if (cachedFont) {
    return cachedFont
  }

  const fontPath = join(process.cwd(), 'assets/fonts/NotoSansSC-Regular.otf')
  cachedFont = await readFile(fontPath)

  return cachedFont
}
