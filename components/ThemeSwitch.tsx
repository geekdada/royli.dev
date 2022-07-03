import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FiMoon, FiSun } from 'react-icons/fi'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      {theme === 'dark' ? (
        <button className="nav-links" onClick={() => setTheme('light')}>
          <FiSun size={20} />
        </button>
      ) : (
        <button className="nav-links" onClick={() => setTheme('dark')}>
          <FiMoon size={20} />
        </button>
      )}
    </>
  )
}

export default ThemeSwitch
