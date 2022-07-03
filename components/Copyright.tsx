const Copyright = ({ canonical }: { canonical: string }) => {
  return (
    <div className="-mx-5 lg:-mx-7 px-5 lg:px-7 bg-light-400 p-4 text-sm dark:bg-dark-400">
      <div className="primary-text font-bold text-lg">All rights reserved</div>
      <div className="secondary-text mt-1">
        Except where otherwise noted, content on this page is copyrighted.
      </div>
      <div className="secondary-text mt-1">{canonical}</div>
    </div>
  )
}

export default Copyright
