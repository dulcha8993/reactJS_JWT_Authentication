import React, { Component } from 'react';
import axios from 'axios';
import Protected from './Protected';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submit = this.submit.bind(this);
    }

    changeEmail(e) {
        console.log(e.target.name);
        console.log(e.target.value);
        this.state.email = e.target.value;
    }

    changePassword(e) {
        this.state.password = e.target.value;
    }

    submit(e) {
        //For avoid reload page when submit
        e.preventDefault();
        axios.post('./getToken', {
            email: this.state.email,
            password: this.state.password
        }).then(res => {
            localStorage.setItem('test-jwt', res.data);
            this.props.history.push('/Protected');
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={e => this.submit(e)}>
                    <label>Email<input type="text" name="email" onChange={e => this.changeEmail(e)} />
                    </label>
                    <label>Password<input type="password" name="password" onChange={e => this.changePassword(e)} />
                    </label>
                    <button type = "submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default Login;