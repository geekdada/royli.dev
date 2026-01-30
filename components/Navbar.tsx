'use client'

import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { FiMenu, FiRss } from 'react-icons/fi'
import Image from 'next/image'

import ThemeSwitch from './ThemeSwitch'

const navigations = [
  {
    name: 'Links',
    link: 'https://poche.app/geekdada',
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
    <header className="primary-text z-10 flex items-center px-4 py-3 justify-between sticky top-0 bg-[#fafafa] dark:bg-[#0a0a0b]">
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

      <div className="flex items-center ">
        <nav className="hidden items-center space-x-2 sm:flex">
          {navigations.map((n, i) => (
            <Link href={n.link} key={n.name} className="nav-links font-mono">
              {n.name}
            </Link>
          ))}
        </nav>

        <div className="block sm:hidden">
          <Menu as="div" className="relative text-left">
            <Menu.Button className="nav-links flex items-center justify-center">
              <FiMenu size={20} />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
              enterFrom="transform scale-95 opacity-0 translate-y-[-4px]"
              enterTo="transform scale-100 opacity-100 translate-y-0"
              leave="transition duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]"
              leaveFrom="transform scale-100 opacity-100 translate-y-0"
              leaveTo="transform scale-95 opacity-0 translate-y-[-4px]"
            >
              <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 ring-1 ring-black/8 p-1.5 dark:bg-neutral-900/80 dark:ring-white/8 dark:shadow-black/20 focus:outline-hidden">
                {navigations.map((n, i) => (
                  <Menu.Item key={n.name}>
                    {({ active }) => (
                      <MenuItemLink href={n.link}>
                        <div
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-100 ${
                            active ? 'bg-black/5 dark:bg-white/8' : ''
                          }`}
                        >
                          {n.name}
                        </div>
                      </MenuItemLink>
                    )}
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
          className="nav-links flex items-center justify-center"
        >
          <FiRss size={20} />
        </a>
      </div>
    </header>
  )
}

export default Navbar
