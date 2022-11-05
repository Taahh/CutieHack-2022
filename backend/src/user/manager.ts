import { User } from "./user";
import * as bcrypt from "bcrypt"
import { getDatabase } from "../database/sqlite";
import { uuid } from "uuidv4";


const USERS: Map<string, User> = new Map<string, User>()


export async function importUser(data: { user: string, password: string }) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt)

    const user = new User(uuid(), data.user, hash)

    const db = getDatabase()
    db.serialize(() => {
        db.run("INSERT INTO `users` (uuid, username, password) VALUES(?, ?, ?)", [user.uniqueId, user.username, user.encryptedPassword], (err) => {
            if (err) {
                return console.error(err)
            }
            console.log(`User inserted, ${user}`)
        })
    })

    USERS.set(user.uniqueId, user)

}

export async function loadUsers() {
    const db = getDatabase()
    db.serialize(() => {
        db.each("SELECT * FROM `users`", (err, row) => {
            if (err) {
                return console.error(err)
            }
            console.log(`${row}`)
        })
    })
}