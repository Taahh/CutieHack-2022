import { Database } from "sqlite3";

const DATABASE = new Database("./data/data.db")

export function establishDatabase() {
    DATABASE.on("open", () => {
        console.log("Created connection for SQLite3")

        DATABASE.serialize(() => {
            DATABASE.run("CREATE TABLE IF NOT EXISTS `users` (uuid VARCHAR(36), username VARCHAR(12), password VARCHAR(20))")
        })
    })

    DATABASE.on("error", (err) => {
        console.error(err)
    })
}

export function getDatabase() {
    return DATABASE
}