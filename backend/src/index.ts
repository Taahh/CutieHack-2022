import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import { User } from "./user/user";

import { uuid } from "uuidv4"
import { executeCode } from "./container/docker";
import { establishDatabase } from "./database/sqlite";
import { loadUsers } from "./user/manager";
import { Server } from "socket.io";
import { GameRoom } from "./room/gameRoom";

const SOCKET = new Server(3002, {
    cors: {
        origin: "*"
    }
})
const APP = express()
const PORT = 3001

const GAME_ROOM = new GameRoom("", "CUTIEHACK")

let runShutdown = false

APP.use(cors(), bodyParser.json(), bodyParser.urlencoded({extended: false}))
APP.post("/room/submit", async (req, res) => {
    const data = req.body
    const code = data.code
    const user = data.user
    console.log(`${ user } - ${ code }`)
    const testUser = new User(uuid(), user, "encrypted")
    testUser.code = code
    let codeOutput = await executeCode(testUser, res)
    SOCKET.emit("submission", `${testUser.username} has ${codeOutput.error ? "submitted" : "completed"} Two Sum.`)
})

APP.get("/room/next", async (req, res) => {
    let newUser = new User(uuid(), `Guest${GAME_ROOM.users.size + 1}`, "")
    GAME_ROOM.users.set(newUser.uniqueId, newUser)
    res.send(newUser)
})

APP.post("/room/check", async (req, res) => {
    const data = req.body
    const user = data.user as User

    if (!GAME_ROOM.users.has(user.uniqueId)) {
        GAME_ROOM.users.set(user.uniqueId, user)
    }
    res.status(200)
})


APP.post("/room/chat", async (req, res) => {
    const chat = req.body.chat
    console.log(chat)
    SOCKET.emit("chat", chat)
})
// planned routes
// /room/create POST
// /room/join/{code} POST
// /room/delete DELETE
// /room/update/{settings} PATCH

// /user/login/ POST

// /user/register/ POST


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
    SOCKET.close(console.error)
}
