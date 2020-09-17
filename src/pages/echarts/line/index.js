import React from 'react'
import { Card, message, Button } from 'antd'
import echartTheme from './../echartTheme'
import axios from 'axios';
import BaseForm from '../../../components/BaseForm/index2'
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼图
import ReactEcharts from 'echarts-for-react'
let options = '1';
let options2
let options3
let options4
export default class line extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        canRender: false,
        formList: [   //查询
            {
                type: 'SELECTshuru',
                label: '视频名称',
                field: 'name',
                placeholder: '',
                width: 100,
                list: [{ id: 1, name: "444" }],
            },
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
            },
        ]
    }
    //动态表单
    dongtaibiaodan = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/spname",
        {
            withCredentials: true
        }
        )
            .then((res) => {
                let form = this.state.formList;
                form[0].list = res.data.spnames
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
        if (params.name == "" || params.name == null || params.time1 == "" || params.time1 == null || params.time2 == "" || params.time2 == null) {
            message.warning('做人要有始有终哦')
        } else {
            options = '1';
            if (options == '1') {
                let date = new Date(params.time1)
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;
                let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
                params.time1 = Y + M 

                let date2 = new Date(params.time2)
                let Y2 = date2.getFullYear() + '-';
                let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) ;
                let D2 = date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate() + ' ';
                params.time2 = Y2 + M2 
                axios.get("http://118.31.45.118:8888/lvyou-ssm1/tbzxbfliang?name=" + params.name + "&time1=" + params.time1 + "&time2=" + params.time2,
                {
                    withCredentials: true
                }
                ).then((res) => {
                    this.setState({
                    })
                    options = res.data[0].tbzxbfl;
                    options2 = res.data[0].qdname
                    options3 = res.data[0].data
                    options4 = res.data[0].spnamees

                })
            } else {
            }
            let option = {
                title: {
                    text: options4 + "播放量"
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: options2
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
                series: options,

            };
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
            axios.get( 'http://118.31.45.118:8888/lvyou-ssm1/tbzxbfliang?name=酷酷少女团&time1=2020-01&time2=2020-02',
                {
                    withCredentials: true
                }
                ).then((res) => {
                this.setState({
                })
                options = res.data[0].tbzxbfl;
                options2 = res.data[0].qdname
                options3 = res.data[0].data
                options4 = res.data[0].spnamees
                console.log(options3);

            })
        } else {
        }
        let option = {
            title: {
                text: options4 + "播放量"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: options2
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
            series: options,

        };



        return option;

    }



    render() {
        return (
            <div>
                <Card>
                    <BaseForm formList={this.state.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card>
                    <ReactEcharts option={this.getOption()} theme="Imooc" style={{ height: 500 }} />
                </Card>
            </div>
        );
    }
}