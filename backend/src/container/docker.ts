import { Docker } from "node-docker-api";
import { User } from "../user/user";

import { python } from "compile-run"
import { Response } from "express";
import * as fs from "fs";
import { Question } from "../question/question";

const TWO_SUM = new Question("01", "Two Sum", "./templates/01-two-sum.py")

const QUESTIONS: Map<string, Question> = new Map<string, Question>()

QUESTIONS.set("01", TWO_SUM)

const ACTIVE_CONTAINERS: Map<string, User> = new Map<string, User>()

const DOCKER = new Docker({
    socketPath: "/var/run/docker.sock"
})

const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
});

export async function executeCode(user: User, response?: Response) {
    if (!fs.existsSync("./runs")) {
        fs.mkdirSync("./runs")
    }

    await fs.readFile(TWO_SUM.file, 'utf-8',async (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        data = data.replaceAll("classPlaceholder", user.username)

        const PATH = "./runs/" + user.username + ".py"
        let file = await fs.writeFile(PATH, data + "\n\n\n" + user.code, console.error)
        python.runFile(PATH).then(async value => {
            console.log(value)
            response.send({
                error: value.stderr != "",
                output: value.stderr != "" ? value.stderr: `Success \n\n${value.stdout}`
            })
            await fs.rm(PATH, console.error)
        }).catch(console.error)

        console.log(data)
    })



}