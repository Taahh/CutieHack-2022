import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import Editor from "@monaco-editor/react";
import React, { CSSProperties, MouseEventHandler, useState } from "react";

import style from "../style/Home.module.css"
import axios from "axios";

const Home = () => {
    const [code, setCode] = useState<string | undefined>("class Solution:\n" +
        "    def twoSum(self, nums, target):\n" +
        "        ")
    const [output, setOutput] = useState<string>("")
    const [outputStyle, setOutputStyle] = useState<CSSProperties>({})

    function submitCode(event: React.MouseEvent<HTMLButtonElement>) {
        // axios.get("http://127.0.0.1:3001/test")
        axios.post("http://127.0.0.1:3001/room/submit", {
            code: code,
            user: "Taahh"
        }).then(value => {
            setOutput(value.data.output)
            setOutputStyle(value.data.error ? {
                color: "red"
            } : {
                color: "green"
            })
        })
    }

    return (
        <div className="main">
            <Navbar bg="warning" variant="dark" expand="lg">
                <Container>

                </Container>
                <Navbar.Collapse>
                    <Nav className="ms-auto container-fluid justify-content-end">
                        {/*<Button href="/login" variant="warning" className="ms-auto">Login</Button>*/}
                        <Button href="/register" variant="light" className="me-1 gray-button">Register</Button>
                        <Button href="/login" variant="light" className="gray-button">Login</Button>
                    </Nav>
                </Navbar.Collapse>
                {/*<Button href="/login" variant="warning">Login</Button>*/}

            </Navbar>

            <Editor
                className={"editor"}
                height="100vh"
                // defaultLanguage={language}
                language="python"
                theme="vs-dark"
                onChange={value => setCode(value)}
                value={code}
                options={{
                    fontSize: 20
                }}
                width="40vw"
            />

            <Button variant="success" className={style.submitButton} onClick={submitCode}>Submit</Button>

            <textarea readOnly={true} className={style.output} style={outputStyle} value={output}>
            </textarea>


        </div>
    )
}

export default Home;