import Time from '@/components/Time'

interface Props {
  canonical: string
  title: string
  publishDate: string
}

const Copyright = ({ canonical, title, publishDate }: Props) => {
  return (
    <div className="-mx-5 lg:-mx-7 px-5 lg:px-7 border-t border-neutral-200 dark:border-neutral-800 py-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-neutral-400 dark:text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          License
        </span>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-5">
        All rights reserved. Except where otherwise noted, content on this page
        is copyrighted.
      </p>

      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <span className="text-neutral-400 dark:text-neutral-500">Title</span>
        <span className="text-neutral-700 dark:text-neutral-200 truncate">
          {title}
        </span>

        <span className="text-neutral-400 dark:text-neutral-500">
          Published
        </span>
        <span className="text-neutral-700 dark:text-neutral-200">
          <Time datetime={publishDate} />
        </span>

        <span className="text-neutral-400 dark:text-neutral-500">URL</span>
        <span className="text-neutral-700 dark:text-neutral-200 truncate font-mono text-xs">
          {canonical}
        </span>
      </div>
    </div>
  )
}

export default Copyright
