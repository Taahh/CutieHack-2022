import { Button, Form, FormLabel } from "react-bootstrap";

import style from "../style/Register.module.css"
import { Fragment, useState } from "react";
import ConditionalElement from "../component/ConditionalElement";

const Register = () => {
    const [ error, setError ] = useState("")
    const onlyAlphabet = /^[a-zA-Z]+$/
    let [ username, setUsername ] = useState("")
    let [ password, setPassword ] = useState("")
    console.log(error)

    function onSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        console.log("runn")
        setError("")
        username = username.trim()
        if (username === "") {
            setError("Username was empty!")
        } else if (!onlyAlphabet.test(username)) {
            setError("Username must only contain alphabetical characters!")
        } else if (username.length < 6) {
            setError("Username must be at least 6 characters!")
        }

        if (error !== "") return
    }

    return (
        <div className={ `${ style.main } text-center` }>
            <Form className={ style.form }>
                <Form.Group className="mb-3" controlId="username">
                    <FormLabel className="text-white">Username</FormLabel>
                    <Form.Control placeholder="Enter username" style={ {
                        width: "20vw"
                    } } onChange={ event => setUsername(event.target.value) }/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <FormLabel className="text-white">Password</FormLabel>
                    <Form.Control type="password" placeholder="Enter password" style={ {
                        width: "20vw"
                    } } onChange={ event => setPassword(event.target.value) }/>
                </Form.Group>

                <Button type="submit" variant="success" onClick={ onSubmit }>Register</Button>
                <ConditionalElement condition={ error === "" } element={
                    <Fragment>
                        <p>HII</p>
                        {/*<label defaultValue={ error }/>*/}
                    </Fragment>
                }/>
            </Form>


        </div>
    )
}

export default Register