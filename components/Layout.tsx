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
        <main className="mt-2 md:mt-4 xl:mt-6 flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
