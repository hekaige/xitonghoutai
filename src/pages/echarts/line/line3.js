import React from 'react'
import { Card } from 'antd'
import echartTheme from './../echartTheme'
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
export default class Line3 extends React.Component {

    componentWillMount() {
        echarts.registerTheme('Imooc', echartTheme);
    }

    getOption = () => {
        let option = {
            title: {
                text: '数据趋势'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总计', '视频广告收入（元）', '儿童会员收入（元）']
            },
            xAxis: {
                data: [
                    '2019-10-05', '2019-10-06', '2019-10-07', '2019-10-08', '2019-10-09', '2019-10-10', '2019-10-11'
                ]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '总计',
                    type: 'line',
                    data: [
                        1200,
                        3000,
                        4500,
                        6000,
                        8000,
                        1200,
                        2000
                    ]
                },
                {
                    name: '视频广告收入（元）',
                    type: 'line',
                    data: [
                        1000,
                        2000,
                        5500,
                        6000,
                        8000,
                        100,
                        12000
                    ]
                },
                {
                    name: '儿童会员收入（元）',
                    type: 'line',
                    data: [
                        100,
                        2000,
                        550,
                        600,
                        8000,
                        100,
                        100
                    ]
                }
            ]
        }
        return option;
    }

    render() {
        return (
            <div>
                <Card title="">
                    <ReactEcharts option={this.getOption()} theme="Imooc" style={{ height: 500 }} />
                </Card>
            </div>
        );
    }
}