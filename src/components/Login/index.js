import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { Modal, Button, Input, message,Form,Checkbox } from 'antd';
import './style.css';
//加密
import CryptoJs from 'crypto-js'
//白名单
import {withRouter} from 'react-router-dom';
import {setToken,setUsername} from "../../utils/cookies"
import cookies from 'react-cookies'
class Login extends Component{

    constructor(props) {
		super(props);
		this.state = {
            login: false,
            modal: false,
			user: '',
			password: ''
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.logout = this.logout.bind(this);
	}

    showModal() {
		this.setState({
			modal: true
		})
    }
    hideModal() {
		this.setState({
			modal: false
		})
    }
    changeUser(e) {
		this.setState({
			user: e.target.value
        })
	}

	changePassword(e) {
		this.setState({
			password: e.target.value
		})
    }
    wangjimima(){
        Modal.info({
            title: "提示",
            content: '请联系管理员'
        })
        return;
    }
    //请求退出接口
    logout(){
            axios.get('http://118.31.45.118:8888/lvyou-ssm1/outlogin',
            {
                withCredentials:true
            })
                .then(res => {
                    console.log(res,"退出");
                    const data = res;
                    if(data){
                        message.success('沙扬娜拉，呜呜呜~');
                        this.props.history.push('/common/dengluye')
                        this.setState({
                            login:false
                        })
                    }else{
                        message.error('不让你走，找管理员才能放你');
                    }
                })
    }
    //用户登录接口
     checkLogin() {
        const { user, password } = this.state;
		const url = `http://118.31.45.118:8888/lvyou-ssm1/loginnn?username=${user}&password=${password}`;
		axios.get(url, {
            withCredentials:true
        } ).then(res => {
            console.log(res.data,"登录");
			const login = res.data;
			if (login) {
                message.success('客官里面坐，小二上茶');
                this.props.history.push('/admin/home')
                this.setState({
                    login:true,
                    modal:false
                })
                
                //储存数据(后端给的数据)
               // setToken (true)
                //路由跳转
			}else {
                message.error('嗨！小傻瓜，你又记错账号密码啦！');
                
			}
		})
	}
    render(){
        const { login } = this.state;
        return(
            <div  className='login'>
             {
					login ?
						<Button type="primary"
                        onClick={this.logout}
                        >退出</Button> :
						<Button 
							type="primary"
							onClick={this.showModal}
						>
							登录
						</Button>
				}
                <Modal
          title="登录"
          visible={this.state.modal} //弹出层展示或隐藏
          onOk={this.checkLogin}
          onCancel={this.hideModal}
        >
          <Input 
          	placeholder='请输入用户名' 
          	style={{ marginBottom: 30 }}
          	value={this.state.user}
          	onChange={this.changeUser}
          />
          <Input
          	placeholder='请输入密码'
              type='password'
              style={{ marginBottom: 30 }}
          	value={this.state.password}
          	onChange={this.changePassword}
          />
            {/* <Checkbox>记住密码</Checkbox> */}
            <a  onClick={this.wangjimima} style={{float:'right'}}>忘记密码</a>
        </Modal>
        
            </div>
        )
    }
    //是否登录的接口  是返回true，否返回false
    componentDidMount() {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/logintype',
        {
            withCredentials:true
        }
        )
			.then(res => {
				const login = res.data
                this.setState({ login })
                // const data = res
                // // //储存数据(后端给的数据)
                // setToken(data.success)
                // setUsername(data.username)
                //路由跳转
                // this.props.history.push('/admin/home')
            })
            
	}
}

export default withRouter(Login);