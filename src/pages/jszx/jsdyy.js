import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
import BaseForm from '../../components/BaseForm'
import ETable from '../../components/ETable'
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
export default class jsdyy extends React.Component {
    state = {
        orderInfo: {},
        list: [],
        isShowOpenCity: false,
        orderConfirmVisble: false
    }
    params = {
        page: 1
    }
    formList = [   //查询
        {
            type: 'SELECT',
            label: '时间 年',
            field: 'id',
            placeholder: '全部',
            initialValue: '0',
            width: 100,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '2019' }, { id: '2', name: '2018' }]
        },
        {
            type: 'SELECT',
            label: '月',
            field: 'cpname',
            placeholder: '全部',
            initialValue: '0',
            width: 100,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '1' }, { id: '2', name: '2' }
                , { id: '3', name: '3' }
                , { id: '4', name: '4' }
                , { id: '5', name: '5' }
                , { id: '6', name: '6' }
                , { id: '7', name: '7' }
                , { id: '8', name: '8' }
                , { id: '9', name: '9' }
                , { id: '10', name: '10' }
                , { id: '11', name: '11' }
                , { id: '12', name: '12' }]
        },
        {
            type: 'SELECT',
            label: '~ 年',
            field: 'conty',
            placeholder: '全部',
            initialValue: '0',
            width: 100,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '2019' }, { id: '2', name: '2018' }]
        },
        {
            type: 'SELECT',
            label: '月',
            field: 'contacts',
            placeholder: '全部',
            initialValue: '0',
            width: 100,
            list: [{ id: '0', name: '全部' }, { id: '1', name: '1' }, { id: '2', name: '2' }
                , { id: '3', name: '3' }
                , { id: '4', name: '4' }
                , { id: '5', name: '5' }
                , { id: '6', name: '6' }
                , { id: '7', name: '7' }
                , { id: '8', name: '8' }
                , { id: '9', name: '9' }
                , { id: '10', name: '10' }
                , { id: '11', name: '11' }
                , { id: '12', name: '12' }]
        },
        {
            type: 'SELECT',
            label: '结算单类型',
            field: 'id',
            placeholder: '简约版',
            initialValue: '1',
            width: 100,
            list: [{ id: '1', name: '简约版' }, { id: '2', name: '详细版' }]
        },
    ]
    componentDidMount() {
        this.requestList();
    }
    handleFilter = (params) => {   //接收查询数据
        this.params = params;
        this.requestList();
    }
    requestList = () => {
        let _this = this;
        axios.requestList(this, '/lvyou-ssm/cpxx', this.params)//发送查询请求,ture
    }
    //默认请求接口数据
    requestList = () => {
        let _this = this;
        axios.ajax({
            url: '/lvyou-ssm1/cpxx',
            data: {
                params: {
                    page: this.params.page
                }
            }
        }).then((res) => {
            var obj = {
                result: {
                    page: 1,
                    page_size: 15,
                    total_count: res.length
                }
            }
            let list = res.map((item, index) => {
                item.key = index;
                return item;
            });
            this.setState({
                list: list,
                // pagination:Utils.pagination(obj,(current)=>{
                //     _this.params.page = current;
                //     // _this.requestList();
                // })
            })
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
        message.warning('暂无图表')
    }
    render() {
        const columns = [
            {
                title: '月份Date',
                width: 120,
                dataIndex: 'id',
                ellipsis:true,
            },
            {
                title: 'OTT ChannelOTT频道',
                width: 120,
                dataIndex: 'cpname',
                ellipsis:true,
                children: [
                    {
                        title: 'OTTRevenue收入',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'age',
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
                        title: 'VODRevenue',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                ]
            },
            {
                title: 'Carriers载体',
                width: 120,
                dataIndex: 'iphon',
                ellipsis:true,
                children: [
                    {
                        title: 'CarriersRevenue载体收入',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '开发分成Developer Split',
                        dataIndex: 'age',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '实际结算款Settlement',
                        dataIndex: 'age',
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
            },
            {
                title: '',
                width: 120,
                dataIndex: 'guanwang',
                ellipsis:true,
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
                <BaseForm formList={this.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="download">导出</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        pagination={this.state.pagination}
                        scroll={{ x: 1500 }}
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
                <FormItem label="月份Date" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.id :
                            getFieldDecorator('id', {
                                initialValue: userInfo.id
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="OTTRevenue收入" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.cpname :
                            getFieldDecorator('cpname', {
                                initialValue: userInfo.cpname
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.conty :
                            getFieldDecorator('conty', {
                                initialValue: userInfo.conty
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jianjie :
                            getFieldDecorator('jianjie', {
                                initialValue: userInfo.jianjie
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="VODRevenue" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.youxiuip :
                            getFieldDecorator('youxiuip', {
                                initialValue: userInfo.youxiuip
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.contacts :
                            getFieldDecorator('contacts', {
                                initialValue: userInfo.contacts
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.emal :
                            getFieldDecorator('emal', {
                                initialValue: userInfo.emal
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="CarriersRevenue载体收入" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.iphon :
                            getFieldDecorator('iphon', {
                                initialValue: userInfo.iphon
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发分成Developer Split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.skype :
                            getFieldDecorator('skype', {
                                initialValue: userInfo.skype
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.dizhi :
                            getFieldDecorator('dizhi', {
                                initialValue: userInfo.dizhi
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="Total总计" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.guanwang :
                            getFieldDecorator('guanwang', {
                                initialValue: userInfo.guanwang
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