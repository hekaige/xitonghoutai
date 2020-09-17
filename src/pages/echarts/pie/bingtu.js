import React from 'react'
import { Card, Button, Table, Form, Select, Modal, message } from 'antd'
import echartTheme from '../themeLight'
import axios from 'axios';
import BaseForm from '../../../components/BaseForm/index2'
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
let options = '1';
let options2
let options3
export default class bingtu2 extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        isShowOpenCity: false,
        orderConfirmVisble: false,
        canRender: false,
        formList: [   //查询
            {
                type: 'SELECTshuru',
                label: '渠道',
                field: 'qdao',
                placeholder: '',
                width: 100,
                list: [{ id: 1, name: "444" }],
            }
        ]
    }
    //动态表单
    dongtaibiaodan = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/qdname",
        {
            withCredentials: true
        }
        )
            .then((res) => {
                let form = this.state.formList;
                form[0].list = res.data.qdname
                this.setState(
                    {
                        formLList: form,
                    },
                    // () => {
                    //     console.log(this.state.shipinmingcheng);
                    // }
                );
            });
    };

    chaxun = (params) => {
        this.params = params;
        if (params.qdao == "" || params.qdao == null) {
            message.warning('做人要有始有终哦')
        } else {
        options = '1';
        if (options == '1') {
            axios.get("http://118.31.45.118:8888/lvyou-ssm1/dqdxxkubt?qdao=" + params.qdao,
            {
                withCredentials: true
            }
            ).then((res) => {
                this.setState({
                })
                console.log("4444444444")
                options = res.data[0].dqdxxkutbbs;
                options2 = res.data[0].dqdxxkutbbs.name;
                options3 = res.data[0].data

            })
        } else {
        }
        let option = {
            title: {
                text: options2,
                x: 'center'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: options3
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c}({d}%)'
            },
            series: options
        }
        return option;
    }

    }


    componentDidMount() {
        this.dongtaibiaodan();
        this.shifoudenglu();
    }
    shifoudenglu() {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/logintype',
        {
            withCredentials:true
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
    componentWillMount() {
        echarts.registerTheme('Imooc', echartTheme);
    }
    getOption = () => {
        if (options == '1') {
            axios.get('http://118.31.45.118:8888/lvyou-ssm1/dqdxxkubt?qdao=爱奇艺',
            {
                withCredentials: true
            }
            ).then((res) => {
                this.setState({
                })
                console.log(res)
                options = res.data[0].dqdxxkutbbs;
                options2 = res.data[0].dqdxxkutbbs.name;
                options3 = res.data[0].data
                console.log(options2);

            })
        } else {
        }
        let option = {
            title: {
                text: options2,
                x: 'center'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: options3
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c}({d}%)'
            },
            series: options
        }
        return option;
    }




    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.state.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card title="">
                    <ReactEcharts option={this.getOption()} theme="Imooc" style={{ height: 500 }} />
                </Card>
            </div>
        );
    }
}