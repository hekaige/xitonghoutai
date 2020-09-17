import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'//没图表
import ETable from './../../components/ETable'
import { Redirect } from 'react-router-dom';
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class cpxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
    }
    formList = [   //查询
        {
            type: 'INPUT',
            label: 'CP ID',
            field: 'cpid',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: 'CP名称',
            field: 'cpname',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '国家',
            field: 'conty',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '联系人',
            field: 'contacts',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '手机',
            field: 'iphon',
            placeholder: '',
            width: 100,
        }
    ]
    //导出
    toExcel() {
        const data = [["ID", "CPID", "CP名称", "国家", "公司介绍", "公司优秀作品orID", "联系人", "邮箱", "手机", "SKYPE", "公司地址", "公司官网", "开发银行信息", "收款账户名", "收款人地址", "收款银行账号", "收款银行名称", "收款银行地址", "SWIFT代码", "权限等级"]]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);
        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `CP信息库.xlsx`)
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if (params.cpid == "" && params.cpname == "" && params.conty == "" && params.contacts == "" && params.iphon == "") {
            message.warning('小迷糊，你忘填格子啦！')
            this.requestList();
        } else {
            // if (params.cpid != "") {
            urls = "http://118.31.45.118:8888/lvyou-ssm1/cpxxcx?cpid=" + params.cpid + "&cpname=" + params.cpname + "&conty=" + params.conty + "&contacts=" + params.contacts + "&iphon=" + params.iphon;
            // } else if (params.cpname != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/cpxxcx?cpname=" + params.cpname;
            // }
            // else if (params.conty != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/cpxxcx?conty=" + params.conty;
            // }
            // else if (params.contacts != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/cpxxcx?contacts=" + params.contacts;
            // }
            // else if (params.iphon != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/cpxxcx?iphon=" + params.iphon;
            // }
            axios.get(urls,
                {
                    withCredentials: true
                }
            ).then((res) => {
                console.log(res, "返回")
                //未登录
                if (res.data.bool == "no") {
                    Modal.info({
                        title: "提示",
                        content: '此树是我栽，此路是我开，若打此路过，右上角登录'
                    })
                    return;
                    //没权限
                } else if (res.data.bool == "mqx") {
                    Modal.info({
                        title: "提示",
                        content: '您没权限操作此按钮，请联系管理员'
                    })
                    return;
                }
                //权限未开启
                else if (res.data.bool == "wkq") {
                    Modal.info({
                        title: "提示",
                        content: '您的权限未开启，请联系管理员'
                    })
                    return;
                }
                //有权限
                else {
                    list = res.data
                    this.setState({
                        list: list
                    })
                }
            })
        }

    }
    //默认请求接口数据
    requestList = () => {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/cpxx',
            {
                withCredentials: true
            }
        ).then((res) => {
            console.log(res, "返回")
            //未登录
            if (res.data.bool == "no") {
                this.props.history.push('/common/dengluye')
                //没权限
            } else if (res.data.bool == "mqx") {
                this.props.history.push('/admin/NoAuth')
            }
            //权限未开启
            else if (res.data.bool == "wkq") {
                this.props.history.push('/admin/quanxianweikaiqi')
            }
            //有权限
            else {
                list = res.data
                this.setState({
                    list: list
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
                content: '我会想你的……',
                onOk() {
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/cpxxsc?id=' + item.id,
                        {
                            withCredentials: true
                        }
                    ).then((res) => {
                        console.log(res, "返回")
                        //未登录
                        if (res.data.bool == "no") {
                            Modal.info({
                                title: "提示",
                                content: '此树是我栽，此路是我开，若打此路过，右上角登录'
                            })
                            return;
                            //没权限
                        } else if (res.data.bool == "mqx") {
                            Modal.info({
                                title: "提示",
                                content: '您没权限操作此按钮，请联系管理员'
                            })
                            return;
                        }
                        //权限未开启
                        else if (res.data.bool == "wkq") {
                            Modal.info({
                                title: "提示",
                                content: '您的权限未开启，请联系管理员'
                            })
                            return;
                        }
                        //有权限
                        else {
                            _this.setState({
                                isVisible: false
                            })
                            _this.requestList();
                            message.success('删除成功')
                        }
                    }
                    )

                }

            })

        }

    }
    //新增提交
    handleSubmit = () => {
        let data = this.userForm.props.form.getFieldsValue();
        let url;
        if (data.cpid == null || data.cpid == '' || data.cpname == null || data.cpname == '' || data.conty == null || data.conty == '' || data.skype == null || data.skype == '' || data.dizhi == null || data.dizhi == '' || data.guanwang == null || data.guanwang == '' || data.yhxinxi == null || data.yhxinxi == '' || data.shouyiren == null || data.shouyiren == '' || data.syrdizhi == null || data.syrdizhi == '' || data.syrzh == null || data.syrzh == '' || data.yhname == null || data.yhname == '' || data.yhdizhi == null || data.yhdizhi == '' || data.swift == null || data.swift == '') {
            message.warning('带小红花的是必填项噢！')
        } else {
            // if (data.id != null) {
            url = "http://118.31.45.118:8888/lvyou-ssm1/cpxxzj";
            if (data.id == null) {
                data.id = 0
            }
            axios.post(url,data,
                {
                    withCredentials: true,
                },
            ).then((res) => {
                console.log(res, "新增")
                //未登录
                if (res.data.bool == "no") {
                    Modal.info({
                        title: "提示",
                        content: '此树是我栽，此路是我开，若打此路过，右上角登录'
                    })
                    return;
                    //没权限
                } else if (res.data.bool == "mqx") {
                    Modal.info({
                        title: "提示",
                        content: '您没权限操作此按钮，请联系管理员'
                    })
                    return;
                }
                //权限未开启
                else if (res.data.bool == "wkq") {
                    Modal.info({
                        title: "提示",
                        content: '您的权限未开启，请联系管理员'
                    })
                    return;
                }//用户名已存在
                else if (res.data.bool == "false") {
                    Modal.info({
                        title: "提示",
                        content: '用户名已存在'
                    })
                    return;
                }
                //有权限
                else {
                    if (res) {
                        this.userForm.props.form.resetFields();    //清除数据
                        this.setState({
                            isVisible: false
                        })
                        message.success('添加成功')
                        this.requestList();
                    }
                }
            })
        }
    }
    render() {
        const columns = [
            {
                title: '序号',
                width: 120,
                dataIndex: 'id',
                render: (text, record, index) => `${index + 1}`,
                fixed: 'left',
                key: 'id',
                ellipsis: true,
            },
            {
                title: 'CP ID',
                width: 120,
                dataIndex: 'cpid',
                key: 'cpid',
                ellipsis: true,
            },
            {
                title: 'CP 名称',
                width: 120,
                dataIndex: 'cpname',
                key: 'cpname',
                ellipsis: true,
            },
            {
                title: '国家',
                width: 120,
                dataIndex: 'conty',
                key: 'conty',
                ellipsis: true,
            },
            {
                title: '公司介绍',
                width: 120,
                dataIndex: 'jianjie',
                key: 'jianjie',
                ellipsis: true,
            },
            {
                title: '公司优秀作品 or ID',
                width: 120,
                dataIndex: 'youxiuip',
                key: 'youxiuip',
                ellipsis: true,
            },
            {
                title: '联系人',
                width: 120,
                dataIndex: 'contacts',
                key: 'contacts',
                ellipsis: true,
            },
            {
                title: '邮箱',
                width: 120,
                dataIndex: 'emal',
                key: 'emal',
                ellipsis: true,
            },
            {
                title: '手机',
                width: 120,
                dataIndex: 'iphon',
                key: 'iphon',
                ellipsis: true,
            },
            {
                title: 'SKYPE',
                width: 120,
                dataIndex: 'skype',
                key: 'skype',
                ellipsis: true,
            },
            {
                title: '公司地址',
                width: 120,
                dataIndex: 'dizhi',
                key: 'dizhi',
                ellipsis: true,
            },
            {
                title: '公司官网',
                width: 120,
                dataIndex: 'guanwang',
                key: 'guanwang',
                ellipsis: true,
            },
            {
                title: '开发银行信息',
                width: 120,
                dataIndex: 'yhxinxi',
                key: 'yhxinxi',
                ellipsis: true,
            },
            {
                title: '收款账户名',
                width: 120,
                dataIndex: 'shouyiren',
                key: 'shouyiren',
                ellipsis: true,
            },
            {
                title: '收款人地址',
                width: 120,
                dataIndex: 'syrdizhi',
                key: 'syrdizhi',
                ellipsis: true,
            },
            {
                title: '收款银行账号',
                width: 120,
                dataIndex: 'syrzh',
                key: 'syrzh',
                ellipsis: true,
            },
            {
                title: '收款银行名称',
                width: 120,
                dataIndex: 'yhname',
                key: 'yhname',
                ellipsis: true,
            },
            {
                title: '收款银行地址',
                width: 120,
                dataIndex: 'yhdizhi',
                key: 'yhdizhi',
                ellipsis: true,
            },
            {
                title: 'SWIFT代码',
                width: 120,
                dataIndex: 'swift',
                key: 'swift',
                ellipsis: true,
            },
            {
                title: '权限等级',
                width: 120,
                dataIndex: 'qxdj',
                key: 'qxdj',
                ellipsis: true,
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
        const rowSelection = {
            type: 'radio'
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create')}>新增</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>编辑</Button>
                    <Button type="primary" icon="eye" onClick={() => this.hanleOperate('detail')}>查看</Button>
                    <Button type="primary" icon="delete" onClick={() => this.hanleOperate('delete')}>删除</Button>
                    <Button type="primary" icon="download" onClick={() => this.toExcel()}>导出</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        rowKey=''
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}//选择
                        columns={columns} //表头
                        dataSource={this.state.list}//数据源
                        selectedRowKeys={this.state.selectedRowKeys}//选择状态
                        selectedItem={this.state.selectedItem}
                        pagination={this.state.pagination} //分页
                        scroll={{ x: 2450 }}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.userForm.props.form.resetFields();//取消数据
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
        let userInfo;
        if (type == 'create') {
            userInfo = {};
        } else {
            userInfo = this.props.userInfo;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        return (
            <Form layout="horizontal">
                <FormItem label="id" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.id :
                            getFieldDecorator('id', {
                                initialValue: userInfo.id
                            })(
                                <Input type="number" placeholder="" disabled="disabled" />
                            )
                    }
                </FormItem>
                <FormItem label="CP ID" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.cpid :
                            getFieldDecorator('cpid', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.cpid,

                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="CP名称" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.cpname :
                            getFieldDecorator('cpname', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.cpname
                            })
                                (
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                    }
                </FormItem>
                <FormItem label="国家" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.conty :
                            getFieldDecorator('conty', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.conty
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="公司介绍" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jianjie :
                            getFieldDecorator('jianjie', {
                                initialValue: userInfo.jianjie
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="公司优秀作品or IP" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.youxiuip :
                            getFieldDecorator('youxiuip', {
                                initialValue: userInfo.youxiuip
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="联系人" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.contacts :
                            getFieldDecorator('contacts', {
                                initialValue: userInfo.contacts
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.emal :
                            getFieldDecorator('emal', {
                                initialValue: userInfo.emal
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="手机" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.iphon :
                            getFieldDecorator('iphon', {
                                initialValue: userInfo.iphon
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="SKYPE" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.skype :
                            getFieldDecorator('skype', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.skype
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="公司地址" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.dizhi :
                            getFieldDecorator('dizhi', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.dizhi
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="公司官网" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.guanwang :
                            getFieldDecorator('guanwang', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.guanwang
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="开发银行信息" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yhxinxi :
                            getFieldDecorator('yhxinxi', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.yhxinxi
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="收款账户名" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.shouyiren :
                            getFieldDecorator('shouyiren', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.shouyiren
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="收款人地址" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.syrdizhi :
                            getFieldDecorator('syrdizhi', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.syrdizhi
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="收款银行账号" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.syrzh :
                            getFieldDecorator('syrzh', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.syrzh
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="收款银行名称" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yhname :
                            getFieldDecorator('yhname', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.yhname
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="收款银行地址" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yhdizhi :
                            getFieldDecorator('yhdizhi', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.yhdizhi
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="SWIFT代码" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.swift :
                            getFieldDecorator('swift', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.swift
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="权限等级" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.qxdj :
                            getFieldDecorator('qxdj', {
                                initialValue: userInfo.qxdj
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
UserForm = Form.create({})(UserForm);