import { FC } from 'react'
import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  path?: string
}

interface Props {
  crumbs: Crumb[]
}

export const Breadcrumbs: FC<Props> = ({ crumbs }) => (
  <ul className="breadcrumbs">
    <li>
      <Link to="/">Главная</Link>
    </li>
    {crumbs.map((crumb, index) => (
      <li key={index}>
        <span className="mx-2">/</span>
        {crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : <span className="breadcrumb-item-active">{crumb.label}</span>}
      </li>
    ))}
  </ul>
)
