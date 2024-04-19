import http from "node:http"
import { Json } from "./middleware/streamsJson.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "../utils/extract-query-params.js"


const server = http.createServer(async (req, res) => {
  const { method, url } = req
  await Json(req)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  })

  if(route) {
    const routeParams = req.url.match(route.path)
    
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    route.handle(req, res)
  }

  res.end()
})


server.listen(3300, () => console.log("sever running"))