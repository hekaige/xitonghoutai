import React from 'react'
import { Card, Button, Table, Form, Select, Modal, message } from 'antd'
import echartTheme from '../themeLight'
import axios from 'axios';
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import BaseForm from '../../../components/BaseForm/index2'
import ReactEcharts from 'echarts-for-react'
let options = '1';
let options2
let options3
let options5
let options6
export default class bingtu extends React.Component {
    formList = [   //查询
        {
            type: '年月',
            label: '开始时间',
            field: 'time1',
            placeholder: '',
            width: 100,
        },
        {
            type: '年月',
            label: '结束时间',
            field: 'time2',
            placeholder: '',
            width: 100,
        }
    ]
    componentDidMount() {
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
    chaxun = (params) => {
        this.params = params;
        if (params.time1 == "" || params.time1 == null || params.time2 == "" || params.time2 == null) {
            message.warning('做人要有始有终哦')
        } else {
            options = '1';
            if (options == '1') {
                let date = new Date(params.time1)
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
                params.time1 = Y + M

                let date2 = new Date(params.time2)
                let Y2 = date2.getFullYear() + '-';
                let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);
                let D2 = date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate() + ' ';
                params.time2 = Y2 + M2
                axios.get("http://118.31.45.118:8888/lvyou-ssm1/qqdsrhzbtzb?time1=" + params.time1 + "&time2=" + params.time2,
                {
                    withCredentials: true
                }
                ).then((res) => {
                    this.setState({
                    })
                    options = res.data[0].nrsrfbuuss;
                options3 = res.data[0].data
                    console.log(options);

                })
            } else {
            }
            let option = {
                title: {
                    text: '渠道分类收入分布',
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
    chaxun2 = (params) => {
        this.params = params;
        if (params.time1 == "" || params.time1 == null || params.time2 == "" || params.time2 == null) {
            message.warning('做人要有始有终哦')
        } else {
            options = '1';
            if (options == '1') {
                let date = new Date(params.time1)
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
                params.time1 = Y + M

                let date2 = new Date(params.time2)
                let Y2 = date2.getFullYear() + '-';
                let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);
                let D2 = date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate() + ' ';
                params.time2 = Y2 + M2
                axios.get("http://118.31.45.118:8888/lvyou-ssm1/qqdsrhzbt?time1=" + params.time1 + "&time2=" + params.time2,
                {
                    withCredentials: true
                }
                ).then((res) => {
                    this.setState({
                    })
                    options5 = res.data[0].nrsrfbuuss;
                options6 = res.data[0].data
                    console.log(options);

                })
            } else {
            }
            let option = {
                title: {
                    text: '各渠道收入分布',
                    x: 'center'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data:options6
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a}<br/>{b}:{c}({d}%)'
                },
                series:options5
            }
            return option;
        }
        
    }
    componentWillMount() {
        echarts.registerTheme('Imooc', echartTheme);
    }
    getOption = () => {
        if (options == '1') {
            axios.get('http://118.31.45.118:8888/lvyou-ssm1/qqdsrhzbtzb?time1=2020-02&time2=2020-04',
            {
                withCredentials: true
            }
            ).then((res) => {
                this.setState({
                })
                options = res.data[0].nrsrfbuuss;
                options3 = res.data[0].data
                console.log(options);

            })
        } else {
        }
        let option = {
            title: {
                text: '渠道分类收入分布',
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


    getOption2 = () => {
        if (options == '1') {
            axios.get('http://118.31.45.118:8888/lvyou-ssm1/qqdsrhzbt?time1=2020-02&time2=2020-04',
            {
                withCredentials: true
            }
            ).then((res) => {
                this.setState({
                })
                options5 = res.data[0].nrsrfbuuss;
                options6 = res.data[0].data
                console.log(options);

            })
        } else {
        }
        let option = {
            title: {
                text: '各渠道收入分布',
                x: 'center'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data:options6
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c}({d}%)'
            },
            series:options5
        }
        return option;
    }



    render() {
        return (
            <div>
                 <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.chaxun,this.chaxun2} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card title="">
                    <ReactEcharts option={this.getOption()} theme="Imooc" style={{ height: 500 }} />
                </Card>
                <Card title="" style={{ marginTop: 10 }}>
                    <ReactEcharts option={this.getOption2()} theme="Imooc" style={{ height: 500 }} />
                </Card>
            </div>
        );
    }
}