// "/task/:id"

export function buildRoutePath(path) {
  const routeParameterRegex = /:([a-zA-Z]+)/g

  const pathWithParams = path.replaceAll(routeParameterRegex, "(?<$1>[a-zA-Z0-9\-_]+)")


  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  
  return pathRegex
}