import clx from 'classnames'

export default function Icon({
  icon,
  className,
}: {
  icon: React.ReactNode
  className?: string
}) {
  return (
    <span className={clx('inline-block component-icon', className)}>
      {icon}
    </span>
  )
}
