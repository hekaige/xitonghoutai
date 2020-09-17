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
export default class dqdspnrsrmx extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        canRender:false,
        formList : [   //查询
            {
                type: 'SELECTshuru',
                label: '渠道',
                field: 'qdao',
                placeholder: '',
                width: 100,
                list:[{id:1,name:"444"}],
            },
            {
                type: 'SELECT',
                label: '时间',
                field: 'time',
                placeholder: '',
                width: 100,
                list:[{id:2017,name:"2017"},{id:2018,name:"2018"},{id:2019,name:"2019"},{id:2020,name:"2020"}],
            }
        ]
    }
     //动态表单
     dongtaibiaodan = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/qdname",    
        )
            .then((res) => {
                let form = this.state.formList;
                form[0].list = res.data.qdname
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
            ['爱奇艺', '', '', '', '', '月份', '', ''],
            ['上线时间', '内容', '合作模式', '总收入', '占比', '1', '2', '3']
        ]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `单渠道视频内容收入明细.xlsx`)
    }
    componentDidMount() {
        this.requestList();
        this.dongtaibiaodan();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        if (params.qdao== "" || params.qdao== null  || params.time == "" ||params.time == null) {
            message.warning('做人要有始有终哦')
            this.requestList();
        } else {
        // let date = new Date(params.time)
        // let Y = date.getFullYear() + '-';
        // let M =(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        // let D =date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate() + ' ';
        // params.time= Y+M+D
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/dqdspnrsrmingxi?qdao=" + params.qdao + "&time=" + params.time,
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/dqdspnrsrmingxi',
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
   openOrderDetail = () => {
        message.warning('暂无图表')
    }
    render() {
        const columns = [
            {
                title: '爱奇艺',
                width: 120,
                dataIndex: 'id',
                ellipsis:true,
                children: [
                    {
                        title: '上线时间',
                        dataIndex: 'sxsj',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '内容',
                        dataIndex: 'spname',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '合作模式',
                        dataIndex: 'hzms',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '总收入',
                        dataIndex: 'zongji',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '占比',
                        dataIndex: 'zhanbi',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '月份',
                width: 120,
                dataIndex: 'cpname',
                ellipsis:true,
                children: [
                    {
                        title: '1',
                        dataIndex: 'yiyue',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '2',
                        dataIndex: 'eryue',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '3',
                        dataIndex: 'sanyue',
                        width: 120,
                        ellipsis:true,
                    }
                ]
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
                    <BaseForm formList={this.state.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
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