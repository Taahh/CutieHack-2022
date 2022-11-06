import { Button, Form, FormLabel } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import React, { CSSProperties, Fragment, MouseEventHandler, useEffect, useState } from "react";

import style from "../style/Home.module.css"
import axios from "axios";
import ConditionalElement from "../component/ConditionalElement";
import { io } from "socket.io-client";


const JAVA_STARTER = "public static class Solution\n" +
    "{\n" +
    "    public static int[] solve(int[] nums, int target) {\n" +
    "\n" +
    "    }\n" +
    "}"
const PYTHON_STARTER = "class Solution:\n" +
    "    def twoSum(self, nums, target):\n" +
    "        "


export type User = {
    uniqueId: string,
    username: string,
    codes: Map<string, string>,
    currLang: string
}

const Home = () => {
    const socket = io("https://cutiehack-socket.taah.dev")
    const [ user, setUser ] = useState<User | undefined>()
    const [ output, setOutput ] = useState<string>("")
    const [ outputStyle, setOutputStyle ] = useState<CSSProperties>({})
    const [ stdout, setStdout ] = useState<string>("")
    const [ chat, setChat ] = useState<string[]>([])
    const [ chatMessage, setChatMessage ] = useState("")

    useEffect(() => {
        axios.get("https://cutiehack-backend.taah.dev/room/chat/history").then(value => {
            let chat = value.data as string[]
            setChat(chat)
        })

        if (localStorage.getItem("user")) {
            let temp = JSON.parse(localStorage.getItem("user") as string) as User
            console.log(temp)
            setUser(temp)
            axios.post("https://cutiehack-backend.taah.dev/room/check", {
                user: temp
            })
        } else {
            axios.get("https://cutiehack-backend.taah.dev/room/next").then(value => {
                let user = value.data as User
                user.codes.set("python", PYTHON_STARTER)
                user.codes.set("java", JAVA_STARTER)
                console.log(value.data)
                localStorage.setItem("user", JSON.stringify(value.data as User))
            })
        }
        socket.on("submission", args => {
            setChat(prevState => prevState.concat(args))
            const elm = document.getElementById("chat")
            if (elm)
                elm.scrollTop = elm.scrollHeight
        })

        socket.on("chat", args => {
            // console.log("HI")
            setChat(prevState => prevState.concat(args))
            const elm = document.getElementById("chat")
            if (elm)
                elm.scrollTop = elm.scrollHeight
        })

    }, [ setUser ])


    function submitCode(event: React.MouseEvent<HTMLButtonElement>) {
        setStdout("")
        setOutput("")
        axios.post("https://cutiehack-backend.taah.dev/room/submit", {
            code: user?.codes.get(user?.currLang) || "",
            user: user?.username
        }).then(value => {
            console.log(value)
            setOutput(value.data.output)
            setOutputStyle(value.data.error ? {
                color: "red"
            } : {
                color: "green"
            })
            if (value.data.stdout !== "") {
                setStdout(value.data.stdout)
            }
        })
    }

    function sendChat() {
        console.log("AA")
        if (chatMessage.trim() === "") return
        console.log("hi")

        const msg = `${ (user as User).username }: ${ chatMessage }`
        // console.log(msg)
        axios.post("https://cutiehack-backend.taah.dev/room/chat", {
            chat: msg
        }).then(value => console.log(value.status))
        setChatMessage("")
    }

    return (
        <div className="main">
            <Editor
                className={ "editor" }
                height="100vh"
                // defaultLanguage={language}
                language="python"
                theme="vs-dark"
                onChange={ value => {
                    if (!user) return
                    let temp = user
                    temp.codes.set(temp.currLang, value || "")
                    setUser(temp)
                    localStorage.setItem("user", JSON.stringify(user)) // unoptimized probably!!
                } }
                value={ user?.codes.get(user?.currLang) || "" }
                options={ {
                    fontSize: 20
                } }
                width="40vw"
            />

            <Button variant="success" className={ style.submitButton } onClick={ submitCode }>Submit</Button>

            <textarea readOnly={ true } className={ style.output } style={ outputStyle } value={ output }/>

            <textarea readOnly={ true } className={ style.chat } id="chat" value={ chat.join("\n") }/>
            <Form className={ style.form } onSubmit={ event => {
                event.preventDefault()
                sendChat()
            } }>
                <Form.Group className="mb-3" controlId="sendChat">
                    <FormLabel className="text-white">Send Chat</FormLabel>
                    <Form.Control placeholder="Enter chat message..." style={ {
                        width: "40vw"
                    } } onChange={ event => setChatMessage(event.target.value) } value={ chatMessage }/>
                </Form.Group>
                <Button id="sendChat" type="submit">Send</Button>
            </Form>

            <ConditionalElement condition={ stdout === "" } element={
                <textarea readOnly={ true } className={ style.stdout + " " + style.output } value={ stdout }/>
            }/>


        </div>
    )
}

export default Home;