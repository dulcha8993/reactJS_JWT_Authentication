import React, { Component } from 'react';
import getJwt from '../helpers/Jwt';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class AuthenticatedComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        const jwt = getJwt();   
        if (!jwt) {
            this.props.history.push('./Login');
        }

        axios.get('/getUser/', { headers: { Authorization: `Bearer ${jwt}` } }).then(res => this.setState({
            user:res.data
        })).catch(err => {
            localStorage.removeItem('test-jwt');
            this.props.history.push('./Login');
        });
    }

    render() {
        if (this.state.user == undefined){
            return (
                <div><h1>Loding...</h1></div>
            );
        }
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(AuthenticatedComponent);