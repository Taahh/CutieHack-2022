import express from "express"
import cors from "cors"
import { User } from "./user/user";

import { uuid } from "uuidv4"
import { executeCode } from "./container/docker";
import { establishDatabase } from "./database/sqlite";
import { loadUsers } from "./user/manager";

const APP = express()
const PORT = 3001

let runShutdown = false


APP.use(cors(), express.json())
APP.get("/test", async (req, res) => {
    console.log(`${req.hostname} - ${req.ip}`)
    res.send("yo mama")
})


APP.post("/room/submit", async (req, res) => {
    const data = req.body
    const code = data.code
    const user = data.user
    console.log(`${user} - ${code}`)
    const testUser = new User(uuid(), user, "encrypted")
    testUser.code = code
    await executeCode(testUser, res)
})

// planned routes
// /room/create POST
// /room/join/{code} POST
// /room/delete DELETE
// /room/update/{settings} PATCH

// /user/login/ POST

// /user/register/ POST

// /room/submit/ POST
// /room/chat/ POST

const SERVER = APP.listen(PORT, async () => {
    console.log(`Express Server started on http://127.0.0.1:${ PORT }`)
    establishDatabase()
    await loadUsers()
    // let user = new User("Taah")
    // user.program.code = "print(\"hi\")"
    // let container = await createContainer(user)
    // console.log(`Python created? ${container}`)
    // console.log(await executeCode(user))

})

process.on('exit', async () => {
    await shutdown()
})

process.on('SIGINT', async () => {
    await shutdown()
})

async function shutdown() {
    if (runShutdown) {
        return
    }
    console.log("Shutting down and destroying all docker instances")
    runShutdown = true
    SERVER.close(console.error)
}
