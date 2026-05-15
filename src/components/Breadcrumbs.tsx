import { FC } from 'react'
import { Link, useLocation, matchPath } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { routeNames } from './routes'

interface Crumb {
  label: string
  path?: string
}

export interface CrumbsProps {
  crumbs: Crumb[]
}

export const Breadcrumbs: FC = () => {
    const location = useLocation()

    const pathnames = location.pathname
      .split('/')
      .filter(Boolean)

    const crumbs = pathnames.map((_, index) => {
      const currentPath =
      '/' + pathnames.slice(0, index + 1).join('/')

      const matchedRoute = routeNames.find(route =>
        matchPath(
          { path: route.path, end: true },
          currentPath
        )
      )

      return {
        path: currentPath,
        label: matchedRoute?.label,
      }
    })
  return (
    <Nav>
      <Nav.Link as={Link} to="/">
        Главная
      </Nav.Link>
      {crumbs.map((crumb, index) => (
        !crumb.label ? null : (
          <Nav.Item key={crumb.path || index} className="breadcrumb-item">
            {crumb.path ? <Nav.Link as={Link} to={crumb.path}> {crumb.label} </Nav.Link> : <div>{crumb.label}</div>}
          </Nav.Item>
        )
      ))}
  </Nav>
  )
}
