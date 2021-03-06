import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm'
import ETable from './../../components/ETable'
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class dspqqdyysjhz extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        canRender:false,
        formList : [   //查询
            {
                type: 'SELECTshuru2',
                label: '视频名称',
                field: 'name',
                placeholder: '',
                width: 100,
                list:[{id:1,name:"444"}],
            },
            {
                type: '年月',
                label: '开始时间',
                field: 'time1',
                placeholder: '2019-09',
                width: 100,
            },
            {
                type: '年月',
                label: '结束时间',
                field: 'time2',
                placeholder: '2019-12',
                width: 100,
            },
        ]
    }
     //动态表单
     dongtaibiaodan = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/spname",
            )
            .then((res) => {
                let form = this.state.formList;
                form[0].list = res.data.spnames
                form[1].list = res.data.qdnames
                this.setState(
                    {
                        formLList:form,
                    },
                    // () => {
                    //     console.log(this.state.shipinmingcheng);
                    // }
                );
            });
    };
   
    //导出
    toExcel() {
        const data = [
            ['汽车小镇', '播放量', '', '','', '', '', '', '','','','会员观看时长（小时）', '', '', '', '', '', '','','','', '热度',  '', '', '', '', '', '','','','', '播放指数', '', '', '', '', '', '','','','',],
            ['日期', '爱奇艺', '优酷', '腾讯', '小米', '海信', '创维', '长虹','B站','咪咕','华为','爱奇艺', '优酷', '腾讯', '小米', '海信', '华为', '长虹','华为','咪咕','B站','爱奇艺', '优酷', '腾讯', '小米', '海信', '创维', '长虹','B站','华为','咪咕','爱奇艺', '优酷', '腾讯', '小米', '海信', '创维', '华为','B站','长虹','咪咕',]
        ]
        for (let i = 0; i < this.state.list.length; i++) {

            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `单视频全渠道运营数据汇总.xlsx`)
    }
    componentDidMount() {
        this.requestList();
        this.dongtaibiaodan();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        if (params.name== "" || params.name== null  || params.time1 == "" ||params.time1 == null  || params.time2 == ""|| params.time2 == null ) {
            message.warning('做人要有始有终哦')
            this.requestList();
        } else {
        let date = new Date(params.time1)
        let Y = date.getFullYear() + '-';
        let M =(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        let D =date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate() + ' ';
        params.time1= Y+M

        let date2 = new Date(params.time2)
        let Y2 = date2.getFullYear() + '-';
        let M2 =(date2.getMonth()+1 < 10 ? '0'+(date2.getMonth()+1) : date2.getMonth()+1);
        let D2 =date2.getDate()< 10 ? '0'+(date2.getDate()) : date2.getDate() + ' ';
        params.time2= Y2+M2
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/gspyyhuizong?name=" + params.name + "&time1=" + params.time1 + "&time2=" + params.time2,
        {
            withCredentials: true
        }
        ).then((res) => {
            console.log(res,"返回")
            //未登录
            if(res.data.bool=="no"){
                Modal.info({
                    title: "提示",
                    content: '此树是我栽，此路是我开，若打此路过，右上角登录'
                })
                return;
            //没权限
            }else if(res.data.bool=="mqx"){
                Modal.info({
                    title: "提示",
                    content: '您没权限操作此按钮，请联系管理员'
                })
                return;
            }
            //权限未开启
            else if(res.data.bool=="wkq"){
                Modal.info({
                    title: "提示",
                    content: '您的权限未开启，请联系管理员'
                })
                return;
            }
            //有权限
            else{
                list = res.data
                this.setState({
                    list:list
                })
            }
            })
        }
    }
    //默认请求接口数据
    requestList = () => {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/gspyyhuizong',
        {
            withCredentials: true
        }
        ).then((res) => {
            console.log(res,"返回")
            //未登录
            if(res.data.bool=="no"){
                this.props.history.push('/common/dengluye')
            //没权限
            }else if(res.data.bool=="mqx"){
                this.props.history.push('/admin/NoAuth')
            }
            //权限未开启
            else if(res.data.bool=="wkq"){
                this.props.history.push('/admin/quanxianweikaiqi')
            }
            //有权限
            else{
                list = res.data
                this.setState({
                    list:list
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
                title: '新增'
            })
        } else if (type == 'edit') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择要编辑的内容'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '编辑',
                userInfo: item
            })
        } else if (type == 'detail') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择要查看的内容'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '查看',
                userInfo: item
            })
        } else {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择要删除的内容'
                })
                return;
            }
            let _this = this;
            Modal.confirm({
                title: '确认删除',
                content: '是否要删除当前选中的内容',
                onOk() {
                    axios.ajax({
                        url: '/user/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res) => {
                        if (res.code == 0) {
                            _this.setState({
                                isVisible: false
                            })
                            _this.requestList();
                        }
                    })
                }
            })
        }
    }
    //新增提交
    handleSubmit = () => {
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url: type == 'create' ? '/user/add' : '/user/edit',
            data: {
                params: data
            }
        }).then((res) => {
            if (res.code == 0) {
                this.userForm.props.form.resetFields();
                this.setState({
                    isVisible: false
                })
                this.requestList();
            }
        })
    }
    //图表
    openOrderDetail = () => {
        window.open(`/#/common/order/detail2/：orderId2`, '_blank')
    }
    render() {
        const columns = [
            {
                title: '播放量',
                width: 120,
                dataIndex: 'cpname',
                ellipsis:true,
                children: [
                    {
                        title: '日期',
                        dataIndex: 'riqi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '爱奇艺',
                        dataIndex: 'bflaiqiyi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '优酷',
                        dataIndex: 'bflyouku',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '腾讯',
                        dataIndex: 'bfltengxun',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '咪咕',
                        dataIndex: 'bflmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '小米',
                        dataIndex: 'bflxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '海信',
                        dataIndex: 'bflhaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '创维',
                        dataIndex: 'bflchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: 'B站',
                        dataIndex: 'bflbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '长虹',
                        dataIndex: 'bflchanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '华为',
                        dataIndex: 'bflhuawei',
                        width: 120,
                        ellipsis:true,
                    },
                ],

            },
            {
                title: '会员观看时长（小时）',
                width: 120,
                dataIndex: '',
                ellipsis:true,
                children:  [
                    {
                        title: '爱奇艺',
                        dataIndex: 'gkscaiqiyi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '优酷',
                        dataIndex: 'gkscyouku',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '腾讯',
                        dataIndex: 'gksctengxun',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '咪咕',
                        dataIndex: 'gkscmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '小米',
                        dataIndex: 'gkscxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '海信',
                        dataIndex: 'gkschaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '创维',
                        dataIndex: 'gkscchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: 'B站',
                        dataIndex: 'gkscbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '长虹',
                        dataIndex: 'gkscchanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '华为',
                        dataIndex: 'gkschuawei',
                        width: 120,
                        ellipsis:true,
                    },
                ],
            },
            {
                title: '热度',
                width: 120,
                dataIndex: '',
                ellipsis:true,
                children: [
                    {
                        title: '爱奇艺',
                        dataIndex: 'rdaiqiyi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '优酷',
                        dataIndex: 'rdyouku',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '腾讯',
                        dataIndex: 'rdtengxun',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '咪咕',
                        dataIndex: 'rdmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '小米',
                        dataIndex: 'rdxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '海信',
                        dataIndex: 'rdhaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '创维',
                        dataIndex: 'rdchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: 'B站',
                        dataIndex: 'rdbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '长虹',
                        dataIndex: 'rdchanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '华为',
                        dataIndex: 'rdchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                ],
            },
            {
                title: '播放指数',
                width: 120,
                dataIndex: '',
                ellipsis:true,
                children: [
                    {
                        title: '爱奇艺',
                        dataIndex: 'bfzsaiqiyi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '优酷',
                        dataIndex: 'bfzsyouku',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '腾讯',
                        dataIndex: 'bfzstengxun',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '咪咕',
                        dataIndex: 'bfzsmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '小米',
                        dataIndex: 'bfzsxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '海信',
                        dataIndex: 'bfzshaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '创维',
                        dataIndex: 'bfzschuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: 'B站',
                        dataIndex: 'bfzsbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '长虹',
                        dataIndex: 'bfzschanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '华为',
                        dataIndex: 'bfzshuawei',
                        width: 120,
                        ellipsis:true,
                    },
                ],
            }
        ]
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
                <Card>
                    <BaseForm formList={this.state.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail}/>
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="download" onClick={() => this.toExcel()}>导出</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        rowKey=''
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        pagination={this.state.pagination}
                        scroll={{ x: 1000 }}
                    />
                </div>
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

            </Form>
        );
    }
}
UserForm = Form.create({})(UserForm);