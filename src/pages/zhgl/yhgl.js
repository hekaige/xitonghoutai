import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'
import ETable from './../../components/ETable'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class cpxxk extends React.Component {
    state = {
        list: [],
        isVisible: false
    }
    formList = [   //查询
        {
            type: 'INPUT',
            label: '用户名',
            field: 'username',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '角色名称',
            field: 'juesename',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '所属部门',
            field: 'bumen',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '是否启用',
            field: 'sfqiyong',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '邮箱',
            field: 'email',
            placeholder: '',
            width: 100,
        }
    ]
    //默认加载
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if (params.username == "" && params.juesename == "" && params.bumen == "" && params.sfqiyong == "" && params.email == "") {
            message.warning('巧妇难为无米之炊，要填好才能查询哟')
            this.requestList();
        } else {
            // if (params.username != "") {
                urls = "http://118.31.45.118:8888/lvyou-ssm1/usercx?username=" + params.username+"&juesename=" + params.juesename+"&bumen=" + params.bumen+"&sfqiyong=" + params.sfqiyong+"&email=" + params.email;
            // } else if (params.juesename != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/usercx?juesename=" + params.juesename;
            // }
            // else if (params.bumen != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/usercx?bumen=" + params.bumen;
            // }
            // else if (params.sfqiyong != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/usercx?sfqiyong=" + params.sfqiyong;
            // }
            // else if (params.email != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/usercx?email=" + params.email;
            // }
            axios.get(urls,
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/userbb',
            {
                withCredentials: true
            }
        ).then(res => {
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
                title: '内部用户新增'
            })
        } else if (type == 'create2') {
            this.setState({
                type,
                isVisible: true,
                title: '外部用户新增'
            })
        }
        else if (type == 'edit') {
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
                content: '真的要离开我吗？呜呜呜',
                onOk() {
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/usersc?id=' + item.id,
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
        //内部新增
        if (data.id == null) {
            if (data.cpid == null) {
                if (data.username == null || data.username == '' || data.juesename == null || data.juesename == '' || data.bumen == null || data.bumen == '' || data.sfqiyong == null || data.sfqiyong == '' || data.email == null || data.email == ''|| data.password == null || data.password == '') {
                    message.warning('呐~花花要填满才行')
                } else {
                    url = "http://118.31.45.118:8888/lvyou-ssm1/userbnbzj?username=" + data.username + "&juesename=" + data.juesename + "&bumen=" + data.bumen + "&sfqiyong=" + data.sfqiyong + "&email=" + data.email+ "&password=" + data.password;
                    encodeURI(url)
                    axios.get(url,
                        {
                            withCredentials: true
                        })
                        .then(res => {
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
                                    content: '用户名已存在'
                                })
                                return;
                            }
                            //有权限
                            else{
                            if (res != undefined) {
                                this.userForm.props.form.resetFields();
                                this.setState({
                                    isVisible: false
                                })
                                this.requestList();
                                 message.success('添加成功')
                            }
                        }
                    })
                }
                //外部新增
            } else {
                if (data.username == null || data.username == '' || data.cpid == null || data.cpid == '' || data.juesename == null || data.juesename == '' || data.bumen == null || data.bumen == '' || data.sfqiyong == null || data.sfqiyong == '' || data.email == null || data.email == '' || data.password == null || data.password == '' || data.piandan == null || data.piandan == '') {
                    message.warning('呐~花花要填满才行')
                } else {
                    url = "http://118.31.45.118:8888/lvyou-ssm1/userzjwb?username=" + data.username + "&cpid=" + data.cpid + "&juesename=" + data.juesename + "&bumen=" + data.bumen + "&sfqiyong=" + data.sfqiyong + "&email=" + data.email + "&password=" + data.password + "&piandan=" + data.piandan;
                    encodeURI(url)
                    axios.get(url,
                        {
                            withCredentials: true
                        })
                        .then(res => {
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
                            if (res != undefined) {
                                this.userForm.props.form.resetFields();
                                this.setState({
                                    isVisible: false
                                })
                                this.requestList();
                            }
                        }
                    })
                }
            }
            //编辑
        } else {
            if (data.username == null || data.username == '' || data.juesename == null || data.juesename == '' || data.bumen == null || data.bumen == '' || data.sfqiyong == null || data.sfqiyong == '' || data.email == null || data.email == ''|| data.password == null || data.password == '') {
                message.warning('呐~花花要填满才行')
            } else {
                url = "http://118.31.45.118:8888/lvyou-ssm1/userbnbzj?id=" + data.id + "&username=" + data.username + "&juesename=" + data.juesename + "&bumen=" + data.bumen + "&sfqiyong=" + data.sfqiyong + "&email=" + data.email + "&password=" + data.password;
                encodeURI(url)
                axios.get(url,
                    {
                        withCredentials: true
                    })
                    .then(res => {
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
                        if (res != undefined) {
                            this.userForm.props.form.resetFields();
                            this.setState({
                                isVisible: false
                            })
                            this.requestList();
                        }
                    }})
            }
        }
    }
    render() {
        const columns = [
            {
                title: '序号',
                width: 120,
                dataIndex: 'id',
                ellipsis: true,
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '用户名',
                width: 120,
                dataIndex: 'username',
                ellipsis: true,
            },
            {
                title: '角色名称',
                width: 120,
                dataIndex: 'juesename',
                ellipsis: true,
            },
            {
                title: '所属部门',
                width: 120,
                dataIndex: 'bumen',
                ellipsis: true,
            },
            {
                title: '是否启用',
                width: 120,
                dataIndex: 'sfqiyong',
                ellipsis: true,
            },
            {
                title: '邮箱',
                width: 120,
                dataIndex: 'email',
                ellipsis: true,
            },
            {
                title: '操作时间',
                width: 120,
                dataIndex: 'cztime',
                ellipsis: true,
            },
            {
                title: '操作人',
                width: 120,
                dataIndex: 'czname',
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
                    <BaseForm formList={this.formList} filterSubmit={this.chaxun} />
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create')}>内部用户新增</Button>
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create2')}>外部用户新增</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>编辑</Button>
                    <Button type="primary" icon="eye" onClick={() => this.hanleOperate('detail')}>查看</Button>
                    <Button type="primary" icon="delete" onClick={() => this.hanleOperate('delete')}>删除</Button>
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
                        scroll={{ x: 965 }}
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
let piandan
//增删改查内容
class UserForm extends React.Component {//栅格结构
    state = {
        shuju: []
    }
    //多选框请求数据   /lvyou-ssm1/cpidcxpiandan?cpid=" + data.cpid
    ajaxCall = () => {
        let data = this.props.form.getFieldsValue();
        console.log(data);
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/cpidcxpiandan?cpid=" + data.cpid,
            {
                withCredentials: true
            })
            .then(res => {
                piandan = res.data.qqq
                this.setState(
                    {
                        shuju: piandan
                    },
                    () => {
                        console.log(piandan);
                    }
                );
            });
    }
    render() {
        let type = this.props.type;
        let userInfo;
        if (type == 'create2' || type == 'create') {
            userInfo = {};
        } else {
            userInfo = this.props.userInfo;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        // function handleChange(value) {
        //     console.log(`selected ${value}`);
        // }
        if (type == 'create2') {
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
                    <FormItem label="所属CP ID" {...formItemLayout}>
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
                                    <Input onKeyUp={() => this.ajaxCall()} type="text" placeholder="" />

                                )
                        }
                    </FormItem>
                    <FormItem label="用户名" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.username :
                                getFieldDecorator('username', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.username
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发主管', name: '研发主管' }, { id: '研发员', name: '研发员' },
                                        { id: '美术主管', name: '美术主管' }, { id: '美术员', name: '美术员' }, { id: '产品主管', name: '产品主管' },
                                        { id: '产品员', name: '产品员' }, { id: '海外事业主管', name: '海外事业主管' }, { id: '海外事业员', name: '海外事业员' },
                                        { id: '市场运营主管', name: '市场运营主管' }, { id: '市场运营员', name: '市场运营员' }, { id: '市场主管', name: '市场主管' },
                                        { id: '市场员', name: '市场员' }, { id: '人事主管', name: '人事主管' }, { id: '人事员', name: '人事员' },
                                        { id: '财务主管', name: '财务主管' }, { id: '财务员', name: '财务员' }, { id: '行政主管', name: '行政主管' },
                                        { id: '行政员', name: '行政员' }, { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="所属部门" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bumen :
                                getFieldDecorator('bumen', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bumen
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发部', name: '研发部' },
                                        { id: '美术部', name: '美术部' }, { id: '产品部', name: '产品部' },
                                        { id: '海外事业部', name: '海外事业部' }, { id: '市场运营部', name: '市场运营部' },
                                        { id: '市场部', name: '市场部' }, { id: '人事部', name: '人事部' },
                                        { id: '财务部', name: '财务部' }, { id: '行政部', name: '行政部' },
                                        { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="是否启用" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sfqiyong :
                                getFieldDecorator('sfqiyong', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.sfqiyong
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '是', name: '是' },
                                        { id: '否', name: '否' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="工作邮箱" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.email :
                                getFieldDecorator('email', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.email
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="密码" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.password :
                                getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.password
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="允许查看的片单" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.piandan :
                                getFieldDecorator('piandan', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.piandan
                                })(
                                    <Select
                                        id="piandan"
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        defaultValue={['china']}
                                        optionLabelProp="value"
                                        placeholder="请先填写想要获取片单的CP ID"
                                    >
                                        {Utils.getOptionList(this.state.shuju)}
                                    </Select>,
                                )
                        }
                    </FormItem>
                </Form>
            );
        }else if(type == 'edit'){
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
                    <FormItem label="用户名" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.username :
                                getFieldDecorator('username', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.username
                                })(
                                    <Input type="text" placeholder="" disabled="disabled"/>
                                )
                        }
                    </FormItem>
                    <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发主管', name: '研发主管' }, { id: '研发员', name: '研发员' },
                                        { id: '美术主管', name: '美术主管' }, { id: '美术员', name: '美术员' }, { id: '产品主管', name: '产品主管' },
                                        { id: '产品员', name: '产品员' }, { id: '海外事业主管', name: '海外事业主管' }, { id: '海外事业员', name: '海外事业员' },
                                        { id: '市场运营主管', name: '市场运营主管' }, { id: '市场运营员', name: '市场运营员' }, { id: '市场主管', name: '市场主管' },
                                        { id: '市场员', name: '市场员' }, { id: '人事主管', name: '人事主管' }, { id: '人事员', name: '人事员' },
                                        { id: '财务主管', name: '财务主管' }, { id: '财务员', name: '财务员' }, { id: '行政主管', name: '行政主管' },
                                        { id: '行政员', name: '行政员' }, { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="所属部门" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bumen :
                                getFieldDecorator('bumen', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bumen
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发部', name: '研发部' },
                                        { id: '美术部', name: '美术部' }, { id: '产品部', name: '产品部' },
                                        { id: '海外事业部', name: '海外事业部' }, { id: '市场运营部', name: '市场运营部' },
                                        { id: '市场部', name: '市场部' }, { id: '人事部', name: '人事部' },
                                        { id: '财务部', name: '财务部' }, { id: '行政部', name: '行政部' },
                                        { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="密码" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.password :
                                getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.password
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="是否启用" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sfqiyong :
                                getFieldDecorator('sfqiyong', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.sfqiyong
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '是', name: '是' },
                                        { id: '否', name: '否' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="工作邮箱" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.email :
                                getFieldDecorator('email', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.email
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                </Form>
            );
        } 
        else {
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
                    <FormItem label="用户名" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.username :
                                getFieldDecorator('username', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.username
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发主管', name: '研发主管' }, { id: '研发员', name: '研发员' },
                                        { id: '美术主管', name: '美术主管' }, { id: '美术员', name: '美术员' }, { id: '产品主管', name: '产品主管' },
                                        { id: '产品员', name: '产品员' }, { id: '海外事业主管', name: '海外事业主管' }, { id: '海外事业员', name: '海外事业员' },
                                        { id: '市场运营主管', name: '市场运营主管' }, { id: '市场运营员', name: '市场运营员' }, { id: '市场主管', name: '市场主管' },
                                        { id: '市场员', name: '市场员' }, { id: '人事主管', name: '人事主管' }, { id: '人事员', name: '人事员' },
                                        { id: '财务主管', name: '财务主管' }, { id: '财务员', name: '财务员' }, { id: '行政主管', name: '行政主管' },
                                        { id: '行政员', name: '行政员' }, { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="所属部门" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bumen :
                                getFieldDecorator('bumen', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bumen
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '研发部', name: '研发部' },
                                        { id: '美术部', name: '美术部' }, { id: '产品部', name: '产品部' },
                                        { id: '海外事业部', name: '海外事业部' }, { id: '市场运营部', name: '市场运营部' },
                                        { id: '市场部', name: '市场部' }, { id: '人事部', name: '人事部' },
                                        { id: '财务部', name: '财务部' }, { id: '行政部', name: '行政部' },
                                        { id: '外部人员', name: '外部人员' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="密码" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.password :
                                getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.password
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="是否启用" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sfqiyong :
                                getFieldDecorator('sfqiyong', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.sfqiyong
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '是', name: '是' },
                                        { id: '否', name: '否' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="工作邮箱" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.email :
                                getFieldDecorator('email', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.email
                                })(
                                    <Input type="text" placeholder="" />
                                )
                        }
                    </FormItem>
                </Form>
            );
        }
    }
}
UserForm = Form.create({})(UserForm);
// OpenCityForm = Form.create({})(OpenCityForm);