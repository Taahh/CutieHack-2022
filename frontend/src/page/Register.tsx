import { Form, FormLabel } from "react-bootstrap";

const Register = () => {
    return (
        <div className="main">
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <FormLabel className="text-white">Username</FormLabel>
                    <Form.Control placeholder="Enter username" />
                </Form.Group>
            </Form>
        </div>
    )
}

export default Register