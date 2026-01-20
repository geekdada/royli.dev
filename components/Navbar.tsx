import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { FiMenu, FiRss } from 'react-icons/fi'
import Image from 'next/image'

import ThemeSwitch from './ThemeSwitch'

const navigations = [
  {
    name: 'Blog',
    link: '/blog',
  },
  {
    name: 'CV',
    link: 'https://url.royli.dev/cv',
  },
  {
    name: 'AMA',
    link: 'https://amazt.netlify.app/people/geekdada/',
  },
  {
    name: 'GitHub',
    link: 'https://github.com/geekdada',
  },
]

const MenuItemLink = (props: { href: string; children: React.ReactNode }) => {
  const { href, children, ...rest } = props
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}

const Navbar: React.FC = () => {
  return (
    <header className="primary-text z-10 flex items-center px-4 py-3 justify-between sticky top-0 backdrop-blur-lg bg-white/30 dark:bg-dark-900/50">
      <div
        style={{
          width: '42px',
          height: '42px',
        }}
      >
        <Link href="/">
          <Image
            className="transition-all duration-150 cursor-pointer dark:invert hover:opacity-80"
            src="/images/logo.png"
            alt="home"
            width={42}
            height={42}
          />
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="hidden items-center space-x-2 sm:flex">
          {navigations.map((n, i) => (
            <Link href={n.link} key={n.name} className="nav-links font-title">
              {n.name}
            </Link>
          ))}
        </nav>

        <div className="block sm:hidden">
          <Menu as="div" className="relative text-left">
            <Menu.Button className="flex items-center text-current">
              <FiMenu size={20} />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-150 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-sm bg-white shadow-lg grid divide-y divide-gray-400/30 dark:bg-dark-700 focus:outline-hidden">
                {navigations.map((n, i) => (
                  <Menu.Item key={n.name}>
                    <MenuItemLink href={n.link}>
                      <div className="py-3 text-center">{n.name}</div>
                    </MenuItemLink>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <ThemeSwitch />

        <a
          href="/blog/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-links"
        >
          <FiRss size={20} />
        </a>
      </div>
    </header>
  )
}

export default Navbar
