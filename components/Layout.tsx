import React from 'react'

import Footer from './Footer'
import Navbar from './Navbar'

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mt-8 flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
