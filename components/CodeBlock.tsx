import * as React from 'react'
import { Code } from 'react-notion-x/build/third-party/code'

import '../lib/utils/prism-libs.js'

const CodeBlock = (...params: Parameters<typeof Code>) => {
  return (
    <div className="code-block">
      <Code {...params[0]} />
    </div>
  )
}

export default CodeBlock
