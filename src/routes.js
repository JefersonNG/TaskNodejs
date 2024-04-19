import shortid from "shortid"
import { DatabaseJson } from "./database/database.js"
import { buildRoutePath } from "../utils/build-route-path.js"

const database = new DatabaseJson()

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/task"),
    handle: (req, res) => {
      const id = shortid.generate()
      const { title, description } = req.body

      const task = {
        id,
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        update_at: new Date()
      }

      database.insert("task", task)

      res.writeHead(201)
    }
  },
  {
    method: "GET",
    path: buildRoutePath("/task"),
    handle: (req, res) => {

      const { search } = req.query

      const data = database.select("task", search ? {
        title: search,
        description: search
      } : null)

      res.end(JSON.stringify(data))
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/task/:id"),
    handle: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params

      const data = database.update({
        title,
        description
      }, id, "task")
      
      res.writeHead(200).end(JSON.stringify(data))
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/task/:id"),
    handle: (req, res) => {
      const { id } = req.params

      database.delete("task", id)
      
      res.writeHead(200).end()
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/task/:id/complete"),
    handle: (req, res) => {
      const { id } = req.params

      database.complete("task", id)

      res.end()
    }
  }
]