import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'//没图表
import ETable from './../../components/ETable'
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class qdxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
    }
    formList = [   //查询
        {
            type: 'INPUT',
            label: '渠道名称',
            field: 'qdname',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '渠道分类',
            field: 'qdfn',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '合作模式',
            field: 'hztyp',
            placeholder: '请使用英文逗号隔开',
            width: 150,
        },
        {
            type: 'INPUT',
            label: '标准要求',
            field: 'bzyaoqiu',
            placeholder: '',
            width: 100,
        },
    ]
    //导出
    toExcel() {
        const data = [["序号",
            '渠道名称',
            '渠道分类',
            ' 合作模式',
            '标准要求',
            '结算分成比例',
            '合作起始时间',
            '后台地址',
            '联系人',
            '邮箱',
            '手机',
            '微信',
            '公司地址',
            '是否导入日表',
            '备注']]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `渠道信息库.xlsx`)
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if(params.qdname=="" &&params.qdfn =="" && params.hztyp ==""&& params.bzyaoqiu==""){
            message.warning('我是谁？我在哪？我在干什么？')
            this.requestList();
        }else{
            // if (params.qdname != "") {
                urls = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxcx?qdname=" + params.qdname+"&qdfn=" + params.qdfn+"&hztyp=" + params.hztyp+"&bzyaoqiu=" + params.bzyaoqiu;
            // } else if (params.qdfn != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxcx?qdfn=" + params.qdfn;
            // }
            // else if (params.hztyp != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxcx?hztyp=" + params.hztyp;
            // }
            // else if (params.bzyaoqiu != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxcx?bzyaoqiu=" + params.bzyaoqiu;
            // }
            axios.get(urls,
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
        let _this = this;
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/qudaoxx',
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
                content: '我要卷铺盖回家呀',
                onOk() {
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/qudaoxxsc?id=' + item.id,
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
                        _this.setState({
                            isVisible: false
                        })
                        _this.requestList();
                        message.success('删除成功')
                    }}
                    )
                
                }
            
            })
           
        }
        
    }
    //新增提交
    handleSubmit = () => {
        let data = this.userForm.props.form.getFieldsValue();
        let url;
        if(data.qdfn == null || data.qdfn == '' ||data.qdname==null||data.qdname==''||data.hztyp==null||data.hztyp==''||data.sfdrrz==null||data.sfdrrz=='' ){
            message.warning('带小红花的是必填项噢！')
        }else{
            if (data.id != null) {
                url = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxzj?id=" + data.id + "&qdname=" + data.qdname + "&qdfn=" + data.qdfn + "&hztyp=" + data.hztyp + "&bzyaoqiu=" + data.bzyaoqiu + "&jiesuanbl=" + data.jiesuanbl + "&hzsjian=" + data.hzsjian + "&htdizhi=" + data.htdizhi + "&lianxir=" + data.lianxir + "&emal=" + data.emal + "&iphon=" + data.iphon + "&weixin=" + data.weixin + "&gsdizhi=" + data.gsdizhi + "&sfdrrz=" + data.sfdrrz + "&beizhu=" + data.beizhu;
            }else{
                if (data.bzyaoqiu == null) {
                    data.bzyaoqiu = ''
                }
                if (data.jiesuanbl == null) {
                    data.jiesuanbl = ''
                } if (data.hzsjian == null) {
                    data.hzsjian = ''
                } if (data.htdizhi == null) {
                    data.htdizhi = ''
                } if (data.lianxir == null) {
                    data.lianxir = ''
                } if (data.emal == null) {
                    data.emal = ''
                } if (data.iphon == null) {
                    data.iphon = ''
                } if (data.weixin == null) {
                    data.weixin = ''
                } if (data.gsdizhi == null) {
                    data.gsdizhi = ''
                } if (data.beizhu == null) {
                    data.beizhu = ''
                }
                url = "http://118.31.45.118:8888/lvyou-ssm1/qudaoxxzj?qdname=" + data.qdname + "&qdfn=" + data.qdfn + "&hztyp=" + data.hztyp + "&bzyaoqiu=" + data.bzyaoqiu + "&jiesuanbl=" + data.jiesuanbl + "&hzsjian=" + data.hzsjian + "&htdizhi=" + data.htdizhi + "&lianxir=" + data.lianxir + "&emal=" + data.emal + "&iphon=" + data.iphon + "&weixin=" + data.weixin + "&gsdizhi=" + data.gsdizhi + "&sfdrrz=" + data.sfdrrz + "&beizhu=" + data.beizhu;
            }
            axios.get(url,
                {
                    withCredentials: true
                }
                ).then(res => {
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
                    }//用户名已存在
                    else if(res.data.bool=="false"){
                        Modal.info({
                            title: "提示",
                            content: '用户名已存在，取个好听点的名字叭~'
                        })
                        return;
                    }
                    //有权限
                    else{
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
                title: '渠道分类',
                width: 120,
                dataIndex: 'qdfn',
                key: 'qdfn',
                ellipsis: true,
            },
            {
                title: '渠道名称',
                width: 120,
                dataIndex: 'qdname',
                key: 'qdname',
                ellipsis: true,
            },
            {
                title: '合作模式',
                width: 120,
                dataIndex: 'hztyp',
                key: 'hztyp',
                ellipsis: true,
            },
            {
                title: '标准要求',
                width: 120,
                dataIndex: 'bzyaoqiu',
                key: 'bzyaoqiu',
                ellipsis: true,
            },
            {
                title: '结算分成比例',
                width: 120,
                dataIndex: 'jiesuanbl',
                key: 'jiesuanbl',
                ellipsis: true,
            },
            {
                title: '合作起始时间',
                width: 120,
                dataIndex: 'hzsjian',
                key: 'hzsjian',
                ellipsis: true,
            },
            {
                title: '后台地址',
                width: 120,
                dataIndex: 'htdizhi',
                key: 'htdizhi',
                ellipsis: true,
            },
            {
                title: '联系人',
                width: 120,
                dataIndex: 'lianxir',
                key: 'lianxir',
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
                title: '微信',
                width: 120,
                dataIndex: 'weixin',
                key: 'weixin',
                ellipsis: true,
            },
            {
                title: '公司地址',
                width: 120,
                dataIndex: 'gsdizhi',
                key: 'gsdizhi',
                ellipsis: true,
            },
            {
                title: '是否导入日表',
                width: 120,
                dataIndex: 'sfdrrz',
                key: 'gsdizhi',
                ellipsis: true,
            },
            {
                title: '备注',
                width: 120,
                dataIndex: 'beizhu',
                key: 'beizhu',
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
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        pagination={this.state.pagination}
                        scroll={{ x: 1850 }}
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
        let userInfo;
        if (type == 'create') {
            userInfo = {};
        } else {
            userInfo = this.props.userInfo;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        const children = [];
        children.push(<Option key={'会员'}>{"会员"}</Option>, 
                    <Option key={'流量'}>{"流量"}</Option>,
                    <Option key={'独代'}>{"独代"}</Option>,
                    <Option key={'免费'}>{"免费"}</Option>,
                    <Option key={'点播'}>{"点播"}</Option>,);

        function handleChange(value) {
            console.log(`selected ${value}`);
        }
        return (
            <Form layout="horizontal">
                <FormItem label="id" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.id :
                            getFieldDecorator('id', {
                                initialValue: userInfo.id
                            })(
                                <Input type="text" maxlength="20" placeholder="" disabled="disabled" />
                            )
                    }
                </FormItem>
                <FormItem label="渠道分类" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.qdfn :
                            getFieldDecorator('qdfn', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.qdfn
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: 'VOD 视频点播平台）', name: 'VOD 视频点播平台' }, { id: 'OTT', name: 'OTT' },
                                    { id: 'IPTV', name: 'IPTV' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="渠道名称" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.qdname :
                            getFieldDecorator('qdname', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.qdname
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="合作模式" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.hztyp :
                            getFieldDecorator('hztyp', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.hztyp
                            })(
                                <Select mode="tags" style={{ width: '100%' }} placeholder="" onChange={handleChange}>
                                    {children}
                                </Select>,
                            )
                    }
                </FormItem>
                <FormItem label="标准要求" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.bzyaoqiu :
                            getFieldDecorator('bzyaoqiu', {
                                initialValue: userInfo.bzyaoqiu
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="结算分成比例" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jiesuanbl :
                            getFieldDecorator('jiesuanbl', {
                                initialValue: userInfo.jiesuanbl
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="合作起始时间" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.hzsjian :
                            getFieldDecorator('hzsjian', {
                                initialValue: userInfo.hzsjian
                            })(
                                <Input type="text" maxlength="20" placeholder="2012-02-02 ~ 2013-03-03" />
                            )
                    }

                </FormItem>
                <FormItem label="后台地址" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.htdizhi :
                            getFieldDecorator('htdizhi', {
                                initialValue: userInfo.htdizhi
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="联系人" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.lianxir :
                            getFieldDecorator('lianxir', {
                                initialValue: userInfo.lianxir
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.emal :
                            getFieldDecorator('emal', {
                                initialValue: userInfo.emal
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
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
                <FormItem label="微信" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.weixin :
                            getFieldDecorator('weixin', {
                                initialValue: userInfo.weixin
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="公司地址" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.gsdizhi :
                            getFieldDecorator('gsdizhi', {
                                initialValue: userInfo.gsdizhi
                            })(
                                <Input type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="是否能够导入日表" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sfdrrz :
                            getFieldDecorator('sfdrrz', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.sfdrrz
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '是', name: '是' }, { id: '否', name: '否' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.beizhu :
                            getFieldDecorator('beizhu', {
                                initialValue: userInfo.beizhu
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
UserForm = Form.create({})(UserForm);