import React from 'react'
import './style.css'
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
export default class dengluye extends React.Component {

    render() {
        return (
            <div>
                <div class="hhhhhh">
                <div class="dasdadas">
                
                </div>
                
                <div class="dog-container">
                    <div class="body"></div>
                    <div class="legA"></div>
                    <div class="legB"></div>
                    <div class="legC"></div>
                    <div class="legD"></div>
                    <div class="tail"></div>
                    <div class="ear"></div>
                    <div class="nose"></div>
                    <div class="eye"></div>
                    <div class="tounge"></div>
                </div>
                </div>
                
            </div>
        );
    }
    componentDidMount() {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/logintype',
            {
                withCredentials: true
            }
        )
            .then(res => {
                console.log(res)
                if (res.data) {
                }
                else {
                    Modal.info({
                        title: "提示",
                        content: '此树是我栽，此路是我开。要打此路过，右上角登录'
                    })
                    return;
                }
            })

    }
}