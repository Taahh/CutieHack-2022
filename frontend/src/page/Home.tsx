import { Button, Form, FormLabel } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import React, { CSSProperties, Fragment, MouseEventHandler, useEffect, useState } from "react";

import style from "../style/Home.module.css"
import axios from "axios";
import ConditionalElement from "../component/ConditionalElement";
import { io } from "socket.io-client";

export type User = {
    uniqueId: string,
    username: string,
    code: string
}


const Home = () => {
    const socket = io("ws://localhost:3002")
    const [ user, setUser ] = useState<User | undefined>()
    const [ output, setOutput ] = useState<string>("")
    const [ outputStyle, setOutputStyle ] = useState<CSSProperties>({})
    const [ stdout, setStdout ] = useState<string>("")
    const [ chat, setChat ] = useState<string[]>([])
    const [ chatMessage, setChatMessage ] = useState("")

    useEffect(() => {
        if (localStorage.getItem("user")) {
            let temp = JSON.parse(localStorage.getItem("user") as string) as User
            console.log(temp)
            setUser(temp)
            axios.post("http://127.0.0.1:3001/room/check", {
                user: temp
            })
        } else {
            axios.get("http://127.0.0.1:3001/room/next").then(value => {
                setUser(value.data as User)
                localStorage.setItem("user", JSON.stringify(value.data as User))
            })
        }
        socket.on("submission", args => {
            setChat(prevState => prevState.concat(args))
        })

        socket.on("chat", args => {
            console.log("HI")
            setChat(prevState => prevState.concat(args))
        })

    }, [ setUser ])


    function submitCode(event: React.MouseEvent<HTMLButtonElement>) {
        setStdout("")
        setOutput("")
        axios.post("http://127.0.0.1:3001/room/submit", {
            code: user?.code,
            user: "Taahh"
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

        const msg = `${(user as User).username}: ${chatMessage}`
        // console.log(msg)
        axios.post("http://127.0.0.1:3001/room/chat", {
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
                    temp.code = value || ""
                    setUser(temp)
                    localStorage.setItem("user", JSON.stringify(user)) // unoptimized probably!!
                } }
                value={ user?.code }
                options={ {
                    fontSize: 20
                } }
                width="40vw"
            />

            <Button variant="success" className={ style.submitButton } onClick={ submitCode }>Submit</Button>

            <textarea readOnly={ true } className={ style.output } style={ outputStyle } value={ output }/>

            <textarea readOnly={ true } className={ style.chat } value={ chat.join("\n") }/>
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