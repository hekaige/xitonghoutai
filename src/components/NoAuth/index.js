import React, {Component} from 'react'
import './style.css'
import axios from 'axios';
export default class NoAuth extends Component{
    render(){
        return(
            <div>
                <div class="dog">
	<div class="ear"></div>
	<div class="ear"></div>
	<div class="cabeza"></div>
	<div class="marca"></div>
	<div class="ojos">
		<div class="brillo"></div>
	</div>
	<div class="ojos">
		<div class="brillo"></div>
	</div>
	<div class="trompa">
		<div class="nariz"></div>
		<div class="boca"></div>
	</div>
	<div class="madibula"></div>
</div>

<div class="texto">
	<span>您没有权限查看此页面，请联系管理员</span>
</div>
            </div>
        )
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
                    this.props.history.push('/common/dengluye')
                }
            })

    }
}

