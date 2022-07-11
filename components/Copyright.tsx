interface Props {
  canonical: string
  title: string
}

const Copyright = ({ canonical, title }: Props) => {
  return (
    <div className="-mx-5 lg:-mx-7 px-5 lg:px-7 bg-light-400 p-4 text-sm dark:bg-dark-400">
      <div className="primary-text font-bold text-lg">All rights reserved</div>
      <div className="secondary-text mt-1">
        Except where otherwise noted, content on this page is copyrighted.
      </div>
      <div className="mt-3 space-y-1">
        <div className="secondary-text mt-1">
          <span>Title: </span>
          <span>{title}</span>
        </div>
        <div className="secondary-text mt-1">
          <span>URL: </span>
          <span>{canonical}</span>
        </div>
      </div>
    </div>
  )
}

export default Copyright
