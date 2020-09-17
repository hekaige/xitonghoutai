import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index'
import ETable from './../../components/ETable'
import XlSX from 'xlsx'
import handleFilterSubmit3 from '../../components/BaseForm'
import FilterForm from './../../components/BaseForm'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class dqdxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
    }
    formList = [   //查询
        {
            type: 'INPUT',
            label: '视频名称',
            field: 'videname',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '模式',
            field: 'hzmoshi',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '上架状态',
            field: 'sjtype',
            placeholder: '',
            width: 100,
        }
    ]
    //导出
    toExcel() {
        const data = [[
            '序号',
            '视频名称',
            '集数',
            '单集时长',
            '上线时间',
            '更新',
            '上架状态',
            '类型',
            '受众群',
            '总集数',
            '总时长',
            '关键词',
            '剧情介绍',
            '剧情亮点',
            '一句话简介',
            '推荐语（10个字以内）',
            '渠道名称',
            '合作模式',
            '合作板块',
            '结算分成比例',
            '上架时间',
            '已更新集数']]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);
        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `单渠道信息库.xlsx`)
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if(params.videname == ""&&params.hzmoshi == ""&&params.sjtype == ""){
            message.warning('请问……你在找什么？')
            this.requestList();
        }else{
            // if (params.videname != "") {
                urls = "http://118.31.45.118:8888/lvyou-ssm1/dqdxxkucx?videname=" + params.videname+"&hzmoshi=" + params.hzmoshi+"&sjtype=" + params.sjtype;
            // }
            // else if (params.hzmoshi != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/dqdxxkucx?hzmoshi=" + params.hzmoshi;
            // }
            // else if (params.sjtype != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/dqdxxkucx?sjtype=" + params.sjtype;
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/dqdxxku',
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
                content: '再见',
                onOk() {
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/dqdxxksc?id=' + item.id,
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
        let url ;
        if(data.videname == null || data.videname == '' || data.sxshijian == null || data.sxshijian == '' || data.qdname == null || data.qdname == '' ||data.hzmoshi == null || data.hzmoshi == '' ){
            message.warning('带小红花的是必填项噢！')
        }else{
            if (data.id != null) {
                url = "http://118.31.45.118:8888/lvyou-ssm1/dqdxxkuzj?id=" + data.id + "&videname=" + data.videname + "&fenjishu=" + data.fenjishu + "&djshic=" + data.djshic + "&sxshijian=" + data.sxshijian + "&gengxin=" + data.gengxin  + "&sjtype=" + data.sjtype + "&leixing=" + data.leixing + "&szhongqun=" + data.szhongqun + "&zjishu=" + data.zjishu + "&zongshic=" + data.zongshic + "&gjianci=" + data.gjianci+ "&jqjieshao=" + data.jqjieshao + "&jqliangdian=" + data.jqliangdian + "&yjhjianjie=" + data.yjhjianjie + "&tuijianyu=" + data.tuijianyu + "&qdname=" + data.qdname+ "&hzmoshi=" + data.hzmoshi+ "&hzbk=" + data.hzbk + "&jsfcbili=" + data.jsfcbili+ "&sjshij=" + data.sjshij+ "&ygxjs=" + data.ygxjs;
            }else{
                if (data.fenjishu==null){
                    data.fenjishu=''
                }if (data.djshic==null){
                    data.djshic=''
                }if (data.gengxin==null){
                    data.gengxin=''
                }if (data.moshi==null){
                    data.moshi=''
                }if (data.sjtype==null){
                    data.sjtype=''
                }if (data.leixing==null){
                    data.leixing=''
                }if (data.szhongqun==null){
                    data.szhongqun=''
                }if (data.zjishu==null){
                    data.zjishu=''
                }if (data.zongshic==null){
                    data.zongshic=''
                }if (data.gjianci==null){
                    data.gjianci=''
                }if (data.jqjieshao==null){
                    data.jqjieshao=''
                }if (data.jqliangdian==null){
                    data.jqliangdian=''
                }if (data.yjhjianjie==null){
                    data.yjhjianjie=''
                }if (data.tuijianyu==null){
                    data.tuijianyu=''
                }if (data.hzbk==null){
                    data.hzbk=''
                }if (data.jsfcbili==null){
                    data.jsfcbili=''
                }if (data.sjshij==null){
                    data.sjshij=''
                }if (data.ygxjs==null){
                    data.ygxjs=''
                }
                url = "http://118.31.45.118:8888/lvyou-ssm1/dqdxxkuzj?videname=" + data.videname + "&fenjishu=" + data.fenjishu + "&djshic=" + data.djshic + "&sxshijian=" + data.sxshijian + "&gengxin=" + data.gengxin  + "&sjtype=" + data.sjtype + "&leixing=" + data.leixing + "&szhongqun=" + data.szhongqun + "&zjishu=" + data.zjishu + "&zongshic=" + data.zongshic + "&gjianci=" + data.gjianci + "&jqjieshao=" + data.jqjieshao + "&jqliangdian=" + data.jqliangdian + "&yjhjianjie=" + data.yjhjianjie + "&tuijianyu=" + data.tuijianyu + "&qdname=" + data.qdname+ "&hzmoshi=" + data.hzmoshi+ "&hzbk=" + data.hzbk + "&jsfcbili=" + data.jsfcbili+ "&sjshij=" + data.sjshij+ "&ygxjs=" + data.ygxjs;
            }
           
            axios.get(url,
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
    //图表
    openOrderDetail = () => {
            window.open(`/#/common/order/detail/：orderId`, '_blank')
    }
    render() {
        const columns = [
            {
                title: '序号',
                width: 120,
                dataIndex: 'id',
                render: (text, record, index) => `${index + 1}`,
                key: 'id',
                ellipsis:true,
            },
            {
                title: '视频名称',
                width: 120,
                dataIndex: 'videname',
  
                ellipsis:true,
            },
            {
                title: '集数',
                width: 120,
                dataIndex: 'fenjishu',
                ellipsis:true,
            },

            {
                title: '单集时长',
                width: 120,
                dataIndex: 'djshic',
                ellipsis:true,
            },

            {
                title: '上线时间',
                width: 120,
                dataIndex: 'sxshijian',
                ellipsis:true,
            },
            {
                title: '更新',
                width: 120,
                dataIndex: 'gengxin',
                ellipsis:true,
            },
            {
                title: '模式',
                width: 120,
                dataIndex: 'hzmoshi',
                ellipsis:true,
            },
            {
                title: '上架状态',
                width: 120,
                dataIndex: 'sjtype',
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
        let userInfo;
        if (type == 'create') {
            userInfo = {};
        } else {
            userInfo = this.props.userInfo;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7},
            wrapperCol: { span: 17 }
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
                                <Input type="text" placeholder="" disabled="disabled" />
                            )
                    }
                </FormItem>
                <FormItem label="视频名称" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.videname :
                            getFieldDecorator('videname', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.videname
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="集数" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.fenjishu :
                            getFieldDecorator('fenjishu', {
                                initialValue: userInfo.fenjishu
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="单集时长" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.djshic :
                            getFieldDecorator('djshic', {
                                initialValue: userInfo.djshic
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="上线时间" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sxshijian :
                            getFieldDecorator('sxshijian', {
                                rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.sxshijian
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="更新" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.gengxin :
                            getFieldDecorator('gengxin', {
                                initialValue: userInfo.gengxin
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="上架状态" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sjtype :
                            getFieldDecorator('sjtype', {
                                initialValue: userInfo.sjtype
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '已完结', name: '已完结' }, { id: '待提审', name: '待提审' },
                                    { id: '更新中', name: '更新中' }, { id: '评审中', name: '评审中' }, { id: '评审驳回', name: '评审驳回' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="类型" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.leixing :
                            getFieldDecorator('leixing', {
                                initialValue: userInfo.leixing
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '早教启蒙', name: '早教启蒙' }, { id: '幽默搞笑', name: '幽默搞笑' },
                                    { id: '艺术创造', name: '艺术创造' }, { id: '健康安全', name: '健康安全' }, { id: '科学认知', name: '科学认知' },
                                    { id: '语言交流', name: '语言交流' }, { id: '社会性格', name: '社会性格' }, { id: '知识课件', name: '知识课件' }, { id: '运动热血', name: '运动热血' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="受众群" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.szhongqun :
                            getFieldDecorator('szhongqun', {
                                initialValue: userInfo.szhongqun
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '0-3', name: '0-3' }, { id: '0-6', name: '0-6' },
                                    { id: '3-6', name: '3-6' }, { id: '3-8', name: '3-8' }, { id: '6-12', name: '6-12' },
                                    { id: '8-12', name: '8-12' }, { id: '6-18', name: '6-18' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="总集数" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.zjishu:
                            getFieldDecorator('zjishu', {
                                initialValue: userInfo.zjishu
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>

                <FormItem label="总时长" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.zongshic :
                            getFieldDecorator('zongshic', {
                                initialValue: userInfo.zongshic
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="关键词" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.gjianci :
                            getFieldDecorator('gjianci', {
                                initialValue: userInfo.gjianci
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="剧情介绍" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jqjieshao :
                            getFieldDecorator('jqjieshao', {
                                initialValue: userInfo.jqjieshao
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="剧情亮点" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jqliangdian :
                            getFieldDecorator('jqliangdian', {
                                initialValue: userInfo.jqliangdian
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="一句话简介" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yjhjianjie :
                            getFieldDecorator('yjhjianjie', {
                                initialValue: userInfo.yjhjianjie
                            })(
                                <TextArea type="text" maxlength="150" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="推荐语（10个字以内）" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.tuijianyu :
                            getFieldDecorator('tuijianyu', {
                                initialValue: userInfo.tuijianyu
                            })(
                                <TextArea type="text" maxlength="30" placeholder="" />
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
                                <Select>
                                    {Utils.getOptionList([{ id: '爱奇艺', name: '爱奇艺' },{ id: '优酷', name: '优酷' },{ id: '小米', name: '小米' },{ id: '腾讯', name: '腾讯' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="合作模式" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.hzmoshi :
                            getFieldDecorator('hzmoshi', { rules: [{
                                required: true,
                                message: '不能为空'
                            }],
                            validateTrigger: ['onBlur', 'onChange'],
                                initialValue: userInfo.hzmoshi
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '会员', name: '会员' }, { id: '流量', name: '流量' },
                                    { id: '独代', name: '独代' }, { id: '免费', name: '免费' }
                                    ,{ id: '点播', name: '点播' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="合作板块" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.hzbk :
                            getFieldDecorator('hzbk', {
                                initialValue: userInfo.hzbk 
                            })(
                                <Select>
                                    {Utils.getOptionList([{ id: '少儿', name: '少儿' }, { id: '动漫', name: '动漫' },
                                    { id: '亲子', name: '亲子' }])}
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="结算分成比例" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.jsfcbili :
                            getFieldDecorator('jsfcbili', {
                                initialValue: userInfo.jsfcbili
                            })(
                                <Input type="text" maxlength="20" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="上架时间" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sjshij:
                            getFieldDecorator('sjshij', {
                                initialValue: userInfo.sjshij
                            })(
                                <Input type="text" maxlength="20" placeholder="2011-01-01" />
                            )
                    }
                </FormItem>
                <FormItem label="已更新集数" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.ygxjs :
                            getFieldDecorator('ygxjs', {
                                initialValue: userInfo.ygxjs
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
// OpenCityForm = Form.create({})(OpenCityForm);