import React from 'react'
import { Card,message } from 'antd'
import echartTheme from './../echartTheme'
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts'
import axios from 'axios';
// 导入饼图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import BaseForm from '../../../components/BaseForm/index2'
let options = '1';
let options2
let options3
export default class Line2 extends React.Component {
    formList = [   //查询
        {
            type: 'lianjixuanze',
            label: '视频名称及其渠道',
            field: 'name',
            placeholder: '',
            width: 100,
        },
        {
            type: 'DATE',
            label: '开始时间',
            field: 'time1',
            placeholder: '',
            width: 100,
        },
        {
            type: 'DATE',
            label: '结束时间',
            field: 'time2',
            placeholder: '',
            width: 100,
        }
    ]
    chaxun = (params) => {
        this.params = params;
        if (params.name == "" || params.name == null || params.time1 == "" || params.time1 == null || params.time2 == "" || params.time2 == null) {
            message.warning('做人要有始有终哦')
        } else {
            options = '1';
            if (options == '1') {
                let date = new Date(params.time1)
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
                params.time1 = Y + M + D

                let date2 = new Date(params.time2)
                let Y2 = date2.getFullYear() + '-';
                let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '-';
                let D2 = date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate() + ' ';
                params.time2 = Y2 + M2 + D2
                axios.get("http://118.31.45.118:8888/lvyou-ssm1/dspsrsjrbline?name=" + params.name[0] + "&qdao=" + params.name[1] + "&time1=" + params.time1 + "&time2=" + params.time2,
                {
                    withCredentials: true
                }
                ).then((res) => {
                    this.setState({
                    })
                    options = res.data[0].tbzxq;
                    options3 = res.data[0].data
                    console.log(options);

                })
            } else {
            }
            let option = {
                title: {
                    text: '数据趋势'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总计(元)', '视频广告收入(元)', '儿童会员收入(元)']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: options3
                },
                yAxis: {
                    type: 'value'
                },
                series: options
            };
    
    
    
    
            return option;
        }
    }
    componentWillMount() {
        echarts.registerTheme('Imooc', echartTheme);
    }
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
    getOption = () => {
        if (options == '1') {
            axios.get('http://118.31.45.118:8888/lvyou-ssm1/dspsrsjrbline?name=a&qdao=aa&time1=2020-06-23&time2=2020-06-28',
            {
                withCredentials: true
            }
            ).then((res) => {
                this.setState({
                })
                options = res.data[0].tbzxq;
                options3 = res.data[0].data
                console.log(options);

            })
        } else {
        }
        let option = {
            title: {
                text: '数据趋势'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总计(元)', '视频广告收入(元)', '儿童会员收入(元)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: options3
            },
            yAxis: {
                type: 'value'
            },
            series: options
        };




        return option;

    }


    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card title="">
                    <ReactEcharts option={this.getOption()} theme="Imooc" style={{ height: 500 }} />
                </Card>
            </div>
        );
    }
}