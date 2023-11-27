import Time from '@/components/Time'

interface Props {
  canonical: string
  title: string
  publishDate: string
}

const Copyright = ({ canonical, title, publishDate }: Props) => {
  return (
    <div className="-mx-5 lg:-mx-7 px-5 lg:px-7 bg-light-400 p-4 text-sm dark:bg-dark-400">
      <div className="primary-text font-bold text-lg">All rights reserved</div>
      <div className="secondary-text mt-1">
        Except where otherwise noted, content on this page is copyrighted.
      </div>
      <div className="mt-3 space-y-1">
        <div className="secondary-text mt-1">
          <span className="font-bold">Title: </span>
          <span>{title}</span>
        </div>
        <div className="secondary-text mt-1">
          <span className="font-bold">Published at: </span>
          <span>
            <Time datetime={publishDate} />
          </span>
        </div>
        <div className="secondary-text mt-1">
          <span className="font-bold">URL: </span>
          <span>{canonical}</span>
        </div>
      </div>
    </div>
  )
}

export default Copyright
