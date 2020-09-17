import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'
import ETable from './../../components/ETable'
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class jsd_jyb extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        canRender:false,
        formList :[   //查询
            {
                type: 'SELECTshuru',
                label: 'CP ID',
                field: 'id',
                placeholder: '',
                initialValue: '',
                width: 100,
                list:[{id:1,name:"444"}],
            },
            {
                type: '年月',
                label: '开始时间',
                field: 'time1',
                placeholder: '',
                initialValue: '0',
                width: 100,
            },
            {
                type: '年月',
                label: '结束时间',
                field: 'time2',
                placeholder: '',
                initialValue: '0',
                width: 100,
            }
        ]
    }
      //动态表单
      dongtaibiaodan = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/cpidddd",
            )
            .then((res) => {
                let form = this.state.formList;
                form[0].list = res.data.cpid
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
            ['合作产品名Project Name', '中文产品名Project Name-CN', '月份Date', 'OTT ChannelOTT频道', '', '', 'Digital Platform(VOD)数字平台', '', '', 'Carriers载体', '', '', 'Total总计', '', '', 'MG预付金'],
            ['', '', '', 'OTTRevenue收入', '开发分成Developer Split', '实际结算款Settlement', 'VODRevenue', '开发分成Developer Split', '实际结算款Settlement', 'CarriersRevenue载体收入', '开发分成Developer Split', '实际结算款Settlement', '', '', '', '']
        ]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `结算单（简约版）.xlsx`)
    }
    componentDidMount() {
        this.requestList();
        this.dongtaibiaodan();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        if (params.id== "" || params.id== null  || params.time1 == "" ||params.time1 == null  || params.time2 == ""|| params.time2 == null ) {
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
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/jsdjianyueb?id=" + params.id + "&time1=" + params.time1+ "&time2=" + params.time2,
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/jsdjianyueb?id=2&time1=2020-01&time2=2020-02',
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
    render() {
        const columns = [
            {
                title: '合作产品名Project Name',
                width: 120,
                dataIndex: '',
                ellipsis:true,
                children: [
                    {
                        title: '',
                        dataIndex: 'pname',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: '中文产品名Project Name-CN',
                width: 120,
                dataIndex: 'id',
                ellipsis:true,
                children: [
                    {
                        title: '',
                        dataIndex: 'pnamecn',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: '月份Date',
                width: 120,
                dataIndex: 'id',
                ellipsis:true,
                children: [
                    {
                        title: '',
                        dataIndex: 'riqi',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'OTT ChannelOTT频道',
                width: 120,
                dataIndex: 'cpname',
                ellipsis:true,
                children: [
                    {
                        title: 'OTTRevenue收入',
                        dataIndex: 'ottsr',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'ottkffcbl',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'ottsjjsk',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'Digital Platform(VOD)数字平台',
                width: 120,
                dataIndex: 'youxiuip',
                ellipsis:true,
                children: [
                    {
                        title: 'VOD收入 VOD Revenue',
                        dataIndex: 'vodsr',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'vodkffcbl',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'vodsjjsk',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'IPTV 网络电视',
                width: 120,
                dataIndex: 'iphon',
                ellipsis:true,
                children: [
                    {
                        title: '运营商收入IPTV Revenue',
                        dataIndex: 'iptvsr',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'iptvkffcbl',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'iptvsjjsk',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'Total总计',
                width: 120,
                dataIndex: 'guanwang',
                ellipsis:true,
                children: [
                    {
                        title: '',
                        dataIndex: 'zongjCNY',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '',
                        dataIndex: 'zongjUSD',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '',
                        dataIndex: 'zongjEURO',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'MG预付金',
                width: 120,
                dataIndex: 'id',
                ellipsis:true,
                children: [
                    {
                        title: '',
                        dataIndex: 'yufujin',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
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
                <BaseForm formList={this.state.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="eye" onClick={() => this.hanleOperate('detail')}>查看</Button>
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
                        scroll={{ x: 1500 }}
                        pagination={{ pageSize: 50 }}
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }
        return (
            <Form layout="horizontal">
                <FormItem label="合作产品名Project Name" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pname :
                            getFieldDecorator('pname', {
                                initialValue: userInfo.pname
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="中文产品名Project Name-CN" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pnamecn :
                            getFieldDecorator('pnamecn', {
                                initialValue: userInfo.pnamecn
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="月份Date" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.riqi :
                            getFieldDecorator('riqi', {
                                initialValue: userInfo.riqi
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="OTTRevenue收入" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.ottsr :
                            getFieldDecorator('ottsr', {
                                initialValue: userInfo.ottsr
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.ottkffcbl :
                            getFieldDecorator('ottkffcbl', {
                                initialValue: userInfo.ottkffcbl
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.ottsjjsk :
                            getFieldDecorator('ottsjjsk', {
                                initialValue: userInfo.ottsjjsk
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="VODRevenue" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pgcsr :
                            getFieldDecorator('pgcsr', {
                                initialValue: userInfo.pgcsr
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pgckffcbl :
                            getFieldDecorator('pgckffcbl', {
                                initialValue: userInfo.pgckffcbl
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pgcsjjsk :
                            getFieldDecorator('pgcsjjsk', {
                                initialValue: userInfo.pgcsjjsk
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="CarriersRevenue载体收入" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.abcsr :
                            getFieldDecorator('abcsr', {
                                initialValue: userInfo.abcsr
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.abckffcbl :
                            getFieldDecorator('abckffcbl', {
                                initialValue: userInfo.abckffcbl
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.abcsjjsk :
                            getFieldDecorator('abcsjjsk', {
                                initialValue: userInfo.abcsjjsk
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="Total总计1" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.zongjCNY :
                            getFieldDecorator('zongjCNY', {
                                initialValue: userInfo.zongjCNY
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="Total总计2" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.zongjUSD :
                            getFieldDecorator('zongjUSD', {
                                initialValue: userInfo.zongjUSD
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="Total总计3" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.zongjEURO :
                            getFieldDecorator('zongjEURO', {
                                initialValue: userInfo.zongjEURO
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="MG预付金" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yufujin :
                            getFieldDecorator('yufujin', {
                                initialValue: userInfo.yufujin
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
// OpenCityForm = Form.create({})(OpenCityForm);