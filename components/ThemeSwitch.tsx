import React, { useState, useEffect } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '@/lib/theme'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      {theme === 'dark' ? (
        <button className="nav-links flex items-center justify-center" onClick={() => setTheme('light')}>
          <FiSun size={20} />
        </button>
      ) : (
        <button className="nav-links flex items-center justify-center" onClick={() => setTheme('dark')}>
          <FiMoon size={20} />
        </button>
      )}
    </>
  )
}

export default ThemeSwitch
