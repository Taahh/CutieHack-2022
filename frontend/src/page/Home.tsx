import { Button, Form, FormLabel } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import React, { CSSProperties, Fragment, MouseEventHandler, useEffect, useState } from "react";

import style from "../style/Home.module.css"
import axios from "axios";
import ConditionalElement from "../component/ConditionalElement";
import { io } from "socket.io-client";

import Guest from '../img/guest.png'


export type User = {
    uniqueId: string,
    username: string,
    code: string
}

type Problem = {
    title: string,
    desc: string
}

type ChatMessage = {
    userId: string,
    content: string
}

const problems: Problem[] = [
    { title: "Two Sum", desc: "aaaa" },
    { title: "Longest Common Subsequence", desc: "aaaaaaaaaaaaaaaaaa" },
    { title: "Dynamic Programming", desc: "aaaa" }
];

const standings = new Map<string, Boolean[]>()
standings.set("Alex", [true, true, true, true])
standings.set("Ambient", [true, true, true, false])
standings.set("Taah", [true, true, true, true])


let LANGS = new Map<string, string>()
LANGS.set("javascript", "JavaScript")
LANGS.set("python", "Python")
LANGS.set("csharp", "C#")

//var backend = "https://cutiehack-backend.taah.dev"
//var socket = "https://cutiehack-socket.taah.dev"
var backend = "http://127.0.0.1:3001"
var socket_url = "http://127.0.0.1:3002"
const url = (s: string) => backend + s;

const Home = () => {
    const socket = io(socket_url)
    const [ user, setUser ] = useState<User | undefined>()
    const [ output, setOutput ] = useState<string>("")
    const [stdout, setStdout] = useState<string>("")
    const [chatLog, setChatLog] = useState<ChatMessage[]>([])
    const [chatMessage, setChatMessage] = useState("")
    const [lang, setLang] = useState<string>("python")
    useEffect(() => {
        //Get chat history
        axios.get(url("/room/chat/history")).then(value => {
            setChatLog(value.data as ChatMessage[])
        })

        //Load user info
        if (localStorage.getItem("user")) {
            let guest = JSON.parse(localStorage.getItem("user") as string) as User
            console.log(guest)
            setUser(guest)
            axios.post(url("/room/check"), {
                user: guest
            })
        } else {


            let password = Math.random().toString(36).substr(2, 8)

            axios.post(url("/guest/register"), {
                password: password

            }).then(value => {
                var identity = value.data as User
                setUser(identity)
                localStorage.setItem("user", JSON.stringify(identity))
            })
        }
        //Socket events
        socket.on("chat", args => {

            setChatLog(log => log.concat(args))

            scrollChat();
        })
        scrollChat();

        function scrollChat() {
            const log = document.getElementById("chatLog")
            if (log)
                log.scrollTop = log.scrollHeight
        }
    }, [ setUser ])


    function submitCode(event: React.MouseEvent<HTMLButtonElement>) {
        setStdout("")
        setOutput("")
        axios.post(url("/room/submit"), {
            code: user?.code,
            user: user?.username
        }).then(value => {
            console.log(value)
            setOutput(value.data.output)
            if (value.data.stdout !== "") {
                setStdout(value.data.stdout)
            }
        })
    }
    function sendChat() {
        console.log("AA")
        if (chatMessage.trim() === "") return
        console.log("hi")

        // console.log(msg)
        axios.post(url("/room/chat"), {
            content: chatMessage
        }).then(value => console.log(value.status))
        setChatMessage("")
    }
    return (
        <div className="main" style={{display:"flex", color:"white"}}>
            <div style={{ width: "25vw", padding: "16px" }}>

                <select style={{ backgroundColor: "black", fontSize: "24px", color:"inherit"} }>
                    {problems.map(prob => <option value={prob.title}>{prob.title}</option>) }
                </select>
                <h2>Problem Title</h2>
                <p>Problem description</p>
            </div>
            <div style={{width:"50vw"} }>
                <div style={{ display: "flex" }}>
                    <select value={lang} onChange={e => {
                        setLang(e.target.value)
                    }}>
                        {Array.from(LANGS.keys()).map(lang =>
                            <option value={lang}>{LANGS.get(lang)}</option>)
                        }
                    </select>
                    <Button variant="success" onClick={submitCode}>Submit</Button>
                </div>
                <div style={{ height: "600px", border: "1px solid white" }}>

                    <Editor
                        className="editor"
                        width="100%"
                        height="100%"
                        language={lang}
                        theme="vs-dark"
                        onChange={value => {
                            if (!user) return
                            let temp = user
                            temp.code = value || ""
                            setUser(temp)
                            localStorage.setItem("user", JSON.stringify(user)) // unoptimized probably!!
                        }}
                        value={user?.code}
                        options={{
                            fontSize: 20
                        }}
                    />
                    <textarea style={{ width: "100%", height: "300px" }} readOnly={true} value={output} />

                </div>

            </div>

            <div style={{width:"25vw", height:"100%"}}>

                <div style={{ width: "100%", height: "300px", padding: "4px", overflow: "auto", border: "1px gray solid" }}>
                    <h3>Standings</h3>
                    {Array.from(standings.keys()).map(player => 
                        <div style={{display:"flex", border:"1px gray solid"}}>

                            <img src={Guest} style={{
                                imageRendering: "pixelated",
                                margin: "4px",
                                width: "32px",
                                height: "32px"
                            }}></img>
                            {standings.get(player)?.map(b =>
                                <div style={{
                                    border: "4px gray solid",
                                    margin: "4px",
                                    width: "32px",
                                    height: "32px",
                                    textAlign: "center",
                                    backgroundColor: (b? "rgb(0, 255, 128)": "transparent")
                                }}>
                                </div>)}
                        </div>)}
                </div>
                <div id="chatLog" style={{ width: "100%", height: "300px", overflowX: "hidden", overflowY: "auto" }}>
                    {chatLog.map(msg =>
                        <div style={{display:"flex", color:"white", border:"1px gray solid"}}>
                            <img src={Guest} style={{ imageRendering: "pixelated", margin: "8px", width: "48px", height: "48px" }}></img>
                            <div>
                                <p style={{ margin: "0px", marginTop: "4px" }}>User</p>
                                <p style={{ wordBreak: "break-word" }}>{msg.content}</p>
                            </div>
                        </div>)}
                </div>

                <Form style={{ display: "flex", width:"100%" }} onSubmit={event => {
                    event.preventDefault()
                    sendChat()
                }}>
                    <Form.Group className="mb-3" controlId="sendChat">
                        <Form.Control placeholder="Enter chat message..." style={{
                            margin:"0px"
                        }} onChange={event => setChatMessage(event.target.value)} value={chatMessage} />
                    </Form.Group>
                    <Button id="sendChat" type="submit" style={{width:"64px"} }>Send</Button>
                </Form>

                <ConditionalElement condition={stdout === ""} element={
                    <textarea readOnly={true} className={style.stdout + " " + style.output} value={stdout} />
                } />
            </div>


        </div>
    )
}

export default Home;