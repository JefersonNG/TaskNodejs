import fs from "node:fs/promises"

const databasePath = new URL("../../db.json", import.meta.url)

export class DatabaseJson {
  #database = {}
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  constructor() {
    fs.readFile(databasePath, "utf8").then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    
    return data
  }

  update(data, id, table) {
    const { title, description } = data
    this.#database[table].filter(row => {
      if(row.id === id) {
        row.title = title
        row.description = description
        row.updated_at = new Date()
      }
    })

    this.#persist()
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
    }

    this.#persist()
  }

  complete(table, id) {
    this.#database[table].filter(row => {
      if(row.id === id) {
        row.update_at = new Date()
        row.completed_at = new Date()
      }
    })

    this.#persist()
  }
}