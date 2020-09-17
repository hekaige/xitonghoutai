import React from 'react';
import { Card, Table, Modal, Button, Descriptions, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm'
import ETable from './../../components/ETable'
import { Redirect } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let username;
let juesename;
let bumen;
let email;
let password;
export default class cpxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        isShowOpenCity: false,
        orderConfirmVisble: false,
        username,
        juesename,
        bumen,
        email,
        password,
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //默认请求接口数据
    requestList = () => {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/dqyonghu',
            {
                withCredentials: true
            })
            .then(res => {
                console.log(res);
                if (res.data == "") {
                    this.props.history.push('/common/dengluye')
                } else {
                    console.log(res, "当前用户");
                    this.setState({
                        username: res.data.username,
                        juesename: res.data.juesename,
                        bumen: res.data.bumen,
                        email: res.data.email,
                        password: res.data.password
                    })

                }
            })

    }
    // 功能区操作
    hanleOperate = (type) => {
        let item = this.state.selectedItem;
        if (type == 'create') {
            this.setState({
                type,
                isVisible: true,
                title: '修改密码'
            })
        }
    }
    //修改密码提交
    handleSubmit = () => {
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/pswxg?pasw=" + data.pasw + "&newpsw=" + data.newpsw + "&renewpsw=" + data.renewpsw,
            {
                withCredentials: true
            })
            .then(res => {
                if (res.data == "") {
                    Modal.info({
                        title: "提示",
                        content: '此树是我栽，此路是我开，若打此路过，右上角登录'
                    })
                    return;
                }
                else {
                    this.userForm.props.form.resetFields();    //清除数据
                    this.setState({
                        isVisible: false
                    })
                    message.success('修改成功，请按F5刷新页面并重新登录')
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/outlogin',
                        {
                            withCredentials: true
                        })
                        .then(res => {
                            console.log(res, "退出");
                            const data = res;
                            if (data) {
                                this.props.history.push('/admin/home')
                                this.setState({
                                    login: false
                                })
                            }
                        })
                }
            })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        let footer = {};
        if (this.state.type == 'detail') {
            footer = {
                footer: null
            }
        }
        return (
            <div>
                <Card className="operate-wrap" style={{ background: '#ECECEC', padding: '30px'}}>
                    {/* <Descriptions title="用户信息" bordered>
                        <Descriptions.Item label="用户名" >{this.state.username}</Descriptions.Item>
                        <Descriptions.Item label="角色名称">{this.state.juesename}</Descriptions.Item>
                        <Descriptions.Item label="所属部门">{this.state.bumen}</Descriptions.Item>
                        <Descriptions.Item label="工作邮箱">{this.state.email}</Descriptions.Item>
                        <Descriptions.Item label="密码">{this.state.password}</Descriptions.Item>
                    </Descriptions> */}
                    <Card title="用户信息" bordered={false} style={{ width: 300,marginLeft:500 }}>
                        <p>用户名：{this.state.username}</p>
                        <p>角色名称：{this.state.juesename}</p>
                        <p>所属部门：{this.state.bumen}</p>
                        <p>工作邮箱：{this.state.email}</p>
                        <p>密码：{this.state.password}</p>
                    </Card>
                    <Button style={{ top: '20px' ,marginLeft:690}} type="primary" icon="edit" onClick={() => this.hanleOperate('create')}>修改密码</Button>
                </Card>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={600}
                    {...footer}
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => { this.userForm = inst; }} />
                </Modal>
            </div>
        );
    }
}
//增删改查内容
class UserForm extends React.Component {//栅格结构
    render() {
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        return (
            <Form layout="horizontal">
                <FormItem label="原密码" {...formItemLayout}>
                    {

                        type == 'detail' ? userInfo.pasw :
                            getFieldDecorator('pasw', {
                                initialValue: userInfo.pasw
                            })
                                (
                                    <Input type="text" placeholder="" />
                                )
                    }
                </FormItem>
                <FormItem label="新密码" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.newpsw :
                            getFieldDecorator('newpsw', {
                                initialValue: userInfo.newpsw
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="再次输入密码" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.renewpsw :
                            getFieldDecorator('renewpsw', {
                                initialValue: userInfo.renewpsw
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
UserForm = Form.create({})(UserForm);