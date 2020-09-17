import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'
import ETable from './../../components/ETable'
import { Redirect } from 'react-router-dom';
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class spjcxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
    }
    formList = [   //查询
        {
            type: 'INPUT',
            label: '视频名称（英文名）',
            field: 'name',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '视频名称（中文名）',
            field: 'names',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '类型',
            field: 'videtyp',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '关键字（标签）',
            field: 'biaoqian',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '授权渠道',
            field: 'sqqdao',
            placeholder: '',
            width: 100,
        },
    ]
    //导出
    toExcel() {
        const data = [["序号",
            '视频名称（英文名）',
            ' 视频名称（中文名）',
            '类型',
            '关键字（标签）',
            ' 受众年龄',
            ' 总集数',
            '单集时长',
            ' 总时长',
            ' 出品时间',
            '剧情简介',
            '一句话简介',
            '剧集亮点',
            '推荐语（10字以内',
            '版权所属国家',
            '主创',
            ' 授权方ID',
            '授权方',
            '代理方 ID',
            '代理方',
            '预付条款',
            '海外结算分成比例',
            ' 授权期限',
            '授权范围',
            '授权渠道',
            '是否独家',
            '公司优秀作品or IP',
            '备注',
            '公司介绍',
            '项目介绍',
            '项目荣誉',
            'IMDb指数']]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);
        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `视频基础信息库.xlsx`)
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if (params.name == "" && params.names == "" && params.videtyp == "" && params.biaoqian == "" && params.sqqdao == "") {
            message.warning('主人，要找什么东东吗？')
            this.requestList();
        } else {
            // if (params.name != "") {
                urls = "http://118.31.45.118:8888/lvyou-ssm1/spxxcx?name=" + params.name +"&names=" + params.names+"&videtyp=" + params.videtyp+"&biaoqian=" + params.biaoqian+"&sqqdao=" + params.sqqdao;
            // } else if (params.names != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/spxxcx?names=" + params.names;
            // }
            // else if (params.videtyp != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/spxxcx?videtyp=" + params.videtyp;
            // }
            // else if (params.biaoqian != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/spxxcx?biaoqian=" + params.biaoqian;
            // }
            // else if (params.sqqdao != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/spxxcx?sqqdao=" + params.sqqdao;
            // }

            axios.get(urls,{
                withCredentials: true
            })
            .then((res) => {
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/spxx',
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
                title: '引入新增'
            })
        } else if (type == 'create2') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择要新增的内容'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '运营新增',
                userInfo: item
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
                title: '引入编辑',
                userInfo: item
            })
        } else if (type == 'edit2') {
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
                title: '运营编辑',
                userInfo: item
            })
        }
        else if (type == 'detail') {
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
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/spxxsc?id=' + item.id,
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
        //引入新增
        if (data.id == null) {
            if (data.name == null || data.name == '' || data.names == null || data.names == '' || data.bqfangid == null || data.bqfangid == '' || data.bqfang == null || data.bqfang == '' || data.jsbl == null || data.jsbl == '') {
                message.warning('带小红花的是必填项噢！')
            } else {
                if (data.videtyp == null) {
                    data.videtyp = ''
                }
                if (data.biaoqian == null) {
                    data.biaoqian = ''
                } if (data.age == null) {
                    data.age = ''
                } if (data.jishu == null) {
                    data.jishu = ''
                } if (data.shichang == null) {
                    data.shichang = ''
                } if (data.zshichang == null) {
                    data.zshichang = ''
                } if (data.chupingsj == null) {
                    data.chupingsj = ''
                } if (data.jqjianjie == null) {
                    data.jqjianjie = ''
                } if (data.yjhjj == null) {
                    data.yjhjj = ''
                } if (data.jqliangdian == null) {
                    data.jqliangdian = ''
                } if (data.tijianyu == null) {
                    data.tijianyu = ''
                } if (data.banquanss == null) {
                    data.banquanss = ''
                } if (data.zhuchuang == null) {
                    data.zhuchuang = ''
                } if (data.dlfangid == null) {
                    data.dlfangid = ''
                } if (data.dlfang == null) {
                    data.dlfang = ''
                } if (data.yftiaokuan == null) {
                    data.yftiaokuan = ''
                } if (data.sqqx == null) {
                    data.sqqx = ''
                } if (data.sqfw == null) {
                    data.sqfw = ''
                } if (data.sqqdao == null) {
                    data.sqqdao = ''
                } if (data.sfdujia == null) {
                    data.sfdujia = ''
                } if (data.zhizuogs == null) {
                    data.zhizuogs = ''
                } if (data.bzhu == null) {
                    data.bzhu = ''
                } if (data.gsjieshao == null) {
                    data.gsjieshao = ''
                } if (data.xmjieshao == null) {
                    data.xmjieshao = ''
                } if (data.xmrongyu == null) {
                    data.xmrongyu = ''
                } if (data.imdbzs == null) {
                    data.imdbzs = ''
                }
                url = "http://118.31.45.118:8888/lvyou-ssm1/spxxzjyr?name=" + data.name + "&names=" + data.names + "&videtyp=" + data.videtyp + "&age=" + data.age + "&jishu=" + data.jishu + "&shichang=" + data.shichang + "&zshichang=" + data.zshichang + "&chupingsj=" + data.chupingsj + "&banquanss=" + data.banquanss + "&zhuchuang=" + data.zhuchuang + "&bqfangid=" + data.bqfangid + "&bqfang=" + data.bqfang + "&dlfangid=" + data.dlfangid + "&dlfang=" + data.dlfang + "&yftiaokuan=" + data.yftiaokuan + "&jsbl=" + data.jsbl + "&sqqx=" + data.sqqx + "&sqfw=" + data.sqfw + "&sqqdao=" + data.sqqdao + "&sfdujia=" + data.sfdujia + "&zhizuogs=" + data.zhizuogs + "&gsjieshao=" + data.gsjieshao + "&xmjieshao=" + data.xmjieshao + "&xmrongyu=" + data.xmrongyu + "&imdbzs=" + data.imdbzs;
                encodeURI(url)
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
                                content: '视频名已存在，加不进去了呢'
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
           
            ////运营新增、引入编辑、运营编辑
        } else {
            //运营新增编辑
            if (data.biaoqian != null) {
                if (data.name == null || data.name == '' || data.names == null || data.names == '') {
                   
                } else {
                    url = "http://118.31.45.118:8888/lvyou-ssm1/spxxzjyy?name=" + data.name + "&names=" + data.names + "&videtyp=" + data.videtyp + "&biaoqian=" + data.biaoqian + "&jqjianjie=" + data.jqjianjie + "&yjhjj=" + data.yjhjj + "&jqliangdian=" + data.jqliangdian + "&tijianyu=" + data.tijianyu + "&bzhu=" + data.bzhu;
                    encodeURI(url)
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
                                content: '视频名已存在，加不进去了呢'
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
                    }}
                    )
                }
                
                //引入编辑
            } else {
                if (data.name == null || data.name == '' || data.names == null || data.names == '' || data.bqfangid == null || data.bqfangid == '' || data.bqfang == null || data.bqfang == '' || data.jsbl == null || data.jsbl == '') {
                    message.warning('带小红花的是必填项噢！')
                } else {
                    console.log("3");
                    url = "http://118.31.45.118:8888/lvyou-ssm1/spxxzjyr?id=" + data.id + "&name=" + data.name + "&names=" + data.names + "&videtyp=" + data.videtyp + "&age=" + data.age + "&jishu=" + data.jishu + "&shichang=" + data.shichang + "&zshichang=" + data.zshichang + "&chupingsj=" + data.chupingsj + "&banquanss=" + data.banquanss + "&zhuchuang=" + data.zhuchuang + "&bqfangid=" + data.bqfangid + "&bqfang=" + data.bqfang + "&dlfangid=" + data.dlfangid + "&dlfang=" + data.dlfang + "&yftiaokuan=" + data.yftiaokuan + "&jsbl=" + data.jsbl + "&sqqx=" + data.sqqx + "&sqfw=" + data.sqfw + "&sqqdao=" + data.sqqdao + "&sfdujia=" + data.sfdujia + "&zhizuogs=" + data.zhizuogs + "&gsjieshao=" + data.gsjieshao + "&xmjieshao=" + data.xmjieshao + "&xmrongyu=" + data.xmrongyu + "&imdbzs=" + data.imdbzs;
                    encodeURI(url)
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
                                content: '视频名已存在，加不进去了呢'
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
            },
            {
                title: '视频名称（英文名）',
                maxwidth: 120,
                dataIndex: 'name',
                ellipsis: true,
            },
            {
                title: '视频名称（中文名）',
                width: 120,
                dataIndex: 'names',
                ellipsis: true,
            },
            {
                title: '类型',
                width: 120,
                dataIndex: 'videtyp',
                ellipsis: true,
            },
            {
                title: '关键字（标签）',
                width: 120,
                dataIndex: 'biaoqian',
                ellipsis: true,
            },
            {
                title: '受众年龄',
                width: 120,
                dataIndex: 'age',
                ellipsis: true,
            },
            {
                title: '总集数',
                width: 120,
                dataIndex: 'jishu',
                ellipsis: true,
            },
            {
                title: '单集时长',
                width: 120,
                dataIndex: 'shichang',
                ellipsis: true,
            },
            {
                title: '总时长',
                width: 120,
                dataIndex: 'zshichang',
                ellipsis: true,
            },
            {
                title: '出品时间',
                width: 120,
                dataIndex: 'chupingsj',
                ellipsis: true,
            },
            {
                title: '剧情简介',
                width: 120,
                dataIndex: 'jqjianjie',
                ellipsis: true,
            },
            {
                title: '一句话简介',
                width: 120,
                dataIndex: 'yjhjj',
                ellipsis: true,
            },
            {
                title: '剧集亮点',
                width: 120,
                dataIndex: 'jqliangdian',
                ellipsis: true,
            },
            {
                title: '推荐语（10字以内）',
                width: 120,
                dataIndex: 'tijianyu',
                ellipsis: true,
            },

            {
                title: '版权所属国家',
                width: 120,
                dataIndex: 'banquanss',
                ellipsis: true,
            },
            {
                title: '主创',
                width: 120,
                dataIndex: 'zhuchuang',
                ellipsis: true,
            },
            {
                title: '授权方ID',
                width: 120,
                dataIndex: 'bqfangid',
                ellipsis: true,
            },
            {
                title: '授权方',
                width: 120,
                dataIndex: 'bqfang',
                ellipsis: true,
            },
            {
                title: '代理方ID',
                width: 120,
                dataIndex: 'dlfangid',
                ellipsis: true,
            },
            {
                title: '代理方',
                width: 120,
                dataIndex: 'dlfang',
                ellipsis: true,
            },
            {
                title: '预付条款',
                width: 120,
                dataIndex: 'yftiaokuan',
                ellipsis: true,
            },
            {
                title: '海外结算分成比例(%)',
                width: 120,
                dataIndex: 'jsbl',
                ellipsis: true,
            },
            {
                title: '授权期限',
                width: 120,
                dataIndex: 'sqqx',
                ellipsis: true,
            },
            {
                title: '授权范围',
                width: 120,
                dataIndex: 'sqfw',
                ellipsis: true,
            },
            {
                title: '授权渠道',
                width: 120,
                dataIndex: 'sqqdao',
                ellipsis: true,
            },
            {
                title: '是否独家',
                width: 120,
                dataIndex: 'sfdujia',
                ellipsis: true,
            },
            {
                title: '公司优秀作品or IP',
                width: 120,
                dataIndex: 'zhizuogs',
                ellipsis: true,
            },
            {
                title: '备注',
                width: 120,
                dataIndex: 'bzhu',
                ellipsis: true,
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
                    <BaseForm formList={this.formList} filterSubmit={this.chaxun} filterSubmit2={this.openOrderDetail} />
                </Card>
                <Card className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create')}>引入新增</Button>
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create2')}>运营新增</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>引入编辑</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit2')}>运营编辑</Button>
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
                        scroll={{ x: 3400 }}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.userForm.props.form.resetFields();//重置表单
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
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        }
        //运营新增
        if (type == 'create2' || type == 'edit2') {
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
                    <FormItem label="视频名称（英文名）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.name :
                                getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.name
                                })(
                                    <Input type="text" maxlength="150" placeholder="" disabled="disabled" />
                                )
                        }
                    </FormItem>
                    <FormItem label="视频名称（中文名）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.names :
                                getFieldDecorator('names', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.names
                                })(
                                    <Input type="text" maxlength="150" placeholder="" disabled="disabled" />
                                )
                        }
                    </FormItem>
                    <FormItem label="类型" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.videtyp :
                                getFieldDecorator('videtyp', {
                                    initialValue: userInfo.videtyp
                                })(
                                    <Select disabled="disabled">
                                        {Utils.getOptionList([{ id: '早教启蒙', name: '早教启蒙' }, { id: '幽默搞笑', name: '幽默搞笑' },
                                        { id: '艺术创造', name: '艺术创造' }, { id: '健康安全', name: '健康安全' }, { id: '科学认知', name: '科学认知' },
                                        { id: '语言交流', name: '语言交流' }, { id: '社会性格', name: '社会性格' }, { id: '知识课件', name: '知识课件' }, { id: '运动热血', name: '运动热血' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="关键字（标签）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.biaoqian :
                                getFieldDecorator('biaoqian', { rules: [{
                                    required: true,
                                    message: '不能为空'
                                }],
                                validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.biaoqian
                                })(
                                    <TextArea  type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="剧情简介" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.jqjianjie :
                                getFieldDecorator('jqjianjie', {
                                    initialValue: userInfo.jqjianjie
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="一句话简介" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.yjhjj :
                                getFieldDecorator('yjhjj', {
                                    initialValue: userInfo.yjhjj
                                })(
                                    <TextArea type="text" maxlength="30" placeholder="" />
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
                    <FormItem label="推荐语（10字以内）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.tijianyu :
                                getFieldDecorator('tijianyu', {
                                    initialValue: userInfo.tijianyu
                                })(
                                    <TextArea type="text" maxlength="30" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bzhu :
                                getFieldDecorator('bzhu', {
                                    initialValue: userInfo.bzhu
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                </Form>
            )
            //引入
        } else if (type == 'create' || type == 'edit') {
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
                    <FormItem label="英文名" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.name :
                                getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.name
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="中文名" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.names :
                                getFieldDecorator('names', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.names
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="类型" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.videtyp :
                                getFieldDecorator('videtyp', {
                                    initialValue: userInfo.videtyp
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '早教启蒙', name: '早教启蒙' }, { id: '幽默搞笑', name: '幽默搞笑' },
                                        { id: '艺术创造', name: '艺术创造' }, { id: '健康安全', name: '健康安全' }, { id: '科学认知', name: '科学认知' },
                                        { id: '语言交流', name: '语言交流' }, { id: '社会性格', name: '社会性格' }, { id: '知识课件', name: '知识课件' }, { id: '运动热血', name: '运动热血' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="受众年龄" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.age :
                                getFieldDecorator('age', {
                                    initialValue: userInfo.age
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
                            type == 'detail' ? userInfo.jishu :
                                getFieldDecorator('jishu', {
                                    initialValue: userInfo.jishu
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="单集时长" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.shichang :
                                getFieldDecorator('shichang', {
                                    initialValue: userInfo.shichang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="总时长" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zshichang :
                                getFieldDecorator('zshichang', {
                                    initialValue: userInfo.zshichang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="出品时间" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.chupingsj :
                                getFieldDecorator('chupingsj', {
                                    initialValue: userInfo.chupingsj
                                })(
                                    <Input type="text" maxlength="20" placeholder="2011-01-01" />
                                )
                        }
                    </FormItem>
                    <FormItem label="版权所属国家" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.banquanss :
                                getFieldDecorator('banquanss', {
                                    initialValue: userInfo.banquanss
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="主创" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zhuchuang :
                                getFieldDecorator('zhuchuang', {
                                    initialValue: userInfo.zhuchuang
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权方ID" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bqfangid :
                                getFieldDecorator('bqfangid', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bqfangid
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权方" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bqfang :
                                getFieldDecorator('bqfang', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bqfang
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="代理方ID" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.dlfangid :
                                getFieldDecorator('dlfangid', {
                                    initialValue: userInfo.dlfangid
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="代理方" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.dlfang :
                                getFieldDecorator('dlfang', {
                                    initialValue: userInfo.dlfang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>

                    <FormItem label="预付条款" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.yftiaokuan :
                                getFieldDecorator('yftiaokuan', {
                                    initialValue: userInfo.yftiaokuan
                                })(
                                    <TextArea type="text" maxlength="30" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="海外结算分成比例(%)" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.jsbl :
                                getFieldDecorator('jsbl', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.jsbl
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权期限" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqqx :
                                getFieldDecorator('sqqx', {
                                    initialValue: userInfo.sqqx
                                })(
                                    <Input type="text" maxlength="20" placeholder="2011-01-01" />
                                )
                        }
                    </FormItem>

                    <FormItem label="授权范围" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqfw :
                                getFieldDecorator('sqfw', {
                                    initialValue: userInfo.sqfw
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '中国大陆地区（除港澳台）', name: '中国大陆地区（除港澳台）' }, { id: '中国地区', name: '中国地区' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="授权渠道" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqqdao :
                                getFieldDecorator('sqqdao', {
                                    initialValue: userInfo.sqqdao
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="是否独家" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sfdujia :
                                getFieldDecorator('sfdujia', {
                                    initialValue: userInfo.sfdujia
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '是', name: '是' }, { id: '否', name: '否' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="公司优秀作品 or IP" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zhizuogs :
                                getFieldDecorator('zhizuogs', {
                                    initialValue: userInfo.zhizuogs
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="公司介绍" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.gsjieshao :
                                getFieldDecorator('gsjieshao', {
                                    initialValue: userInfo.gsjieshao
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="项目介绍" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.xmjieshao :
                                getFieldDecorator('xmjieshao', {
                                    initialValue: userInfo.xmjieshao
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="项目荣誉" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.xmrongyu :
                                getFieldDecorator('xmrongyu', {
                                    initialValue: userInfo.xmrongyu
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="IMDb指数" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.imdbzs :
                                getFieldDecorator('imdbzs', {
                                    initialValue: userInfo.imdbzs
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                </Form>
            );
        }
        //其他
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
                    <FormItem label="视频名称（英文名）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.name :
                                getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.name
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="视频名称（中文名）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.names :
                                getFieldDecorator('names', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.names
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="类型" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.videtyp :
                                getFieldDecorator('videtyp', {
                                    initialValue: userInfo.videtyp
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '早教启蒙', name: '早教启蒙' }, { id: '幽默搞笑', name: '幽默搞笑' },
                                        { id: '艺术创造', name: '艺术创造' }, { id: '健康安全', name: '健康安全' }, { id: '科学认知', name: '科学认知' },
                                        { id: '语言交流', name: '语言交流' }, { id: '社会性格', name: '社会性格' }, { id: '知识课件', name: '知识课件' }, { id: '运动热血', name: '运动热血' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="关键字（标签）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.biaoqian :
                                getFieldDecorator('biaoqian', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.biaoqian
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="受众年龄" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.age :
                                getFieldDecorator('age', {
                                    initialValue: userInfo.age
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
                            type == 'detail' ? userInfo.jishu :
                                getFieldDecorator('jishu', {
                                    initialValue: userInfo.jishu
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="单集时长" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.shichang :
                                getFieldDecorator('shichang', {
                                    initialValue: userInfo.shichang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="总时长" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zshichang :
                                getFieldDecorator('zshichang', {
                                    initialValue: userInfo.zshichang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="出品时间" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.chupingsj :
                                getFieldDecorator('chupingsj', {
                                    initialValue: userInfo.chupingsj
                                })(
                                    <Input type="text" maxlength="20" placeholder="2010-01-01" />
                                )
                        }
                    </FormItem>
                    <FormItem label="剧情简介" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.jqjianjie :
                                getFieldDecorator('jqjianjie', {
                                    initialValue: userInfo.jqjianjie
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="一句话简介" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.yjhjj :
                                getFieldDecorator('yjhjj', {
                                    initialValue: userInfo.yjhjj
                                })(
                                    <Input type="text" maxlength="30" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="剧集亮点" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.jqliangdian :
                                getFieldDecorator('jqliangdian', {
                                    initialValue: userInfo.jqliangdian
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="推荐语（10字以内）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.tijianyu :
                                getFieldDecorator('tijianyu', {
                                    initialValue: userInfo.tijianyu
                                })(
                                    <Input type="text" maxlength="10" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="版权所属国家" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.banquanss :
                                getFieldDecorator('banquanss', {
                                    initialValue: userInfo.banquanss
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="主创" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zhuchuang :
                                getFieldDecorator('zhuchuang', {
                                    initialValue: userInfo.zhuchuang
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权方ID" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bqfangid :
                                getFieldDecorator('bqfangid', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bqfangid
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权方" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bqfang :
                                getFieldDecorator('bqfang', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.bqfang
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="代理方ID" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.dlfangid :
                                getFieldDecorator('dlfangid', {
                                    initialValue: userInfo.dlfangid
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="代理方" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.dlfang :
                                getFieldDecorator('dlfang', {
                                    initialValue: userInfo.dlfang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="预付条款" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.yftiaokuan :
                                getFieldDecorator('yftiaokuan', {
                                    initialValue: userInfo.yftiaokuan
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="海外结算分成比例(%)" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.jsbl :
                                getFieldDecorator('jsbl', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.jsbl
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权期限" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqqx :
                                getFieldDecorator('sqqx', {
                                    initialValue: userInfo.sqqx
                                })(
                                    <Input type="text" maxlength="20" placeholder="2010-01-01" />
                                )
                        }
                    </FormItem>
                    <FormItem label="授权范围" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqfw :
                                getFieldDecorator('sqfw', {
                                    initialValue: userInfo.sqfw
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '中国大陆地区（除港澳台）', name: '中国大陆地区（除港澳台）' }, { id: '中国地区', name: '中国地区' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="授权渠道" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sqqdao :
                                getFieldDecorator('sqqdao', {
                                    initialValue: userInfo.sqqdao
                                })(
                                    <Input type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="是否独家" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.sfdujia :
                                getFieldDecorator('sfdujia', {
                                    initialValue: userInfo.sfdujia
                                })(
                                    <Select>
                                        {Utils.getOptionList([{ id: '是', name: '是' }, { id: '否', name: '否' }])}
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label="公司优秀作品or IP" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.zhizuogs :
                                getFieldDecorator('zhizuogs', {
                                    initialValue: userInfo.zhizuogs
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bzhu :
                                getFieldDecorator('bzhu', {
                                    initialValue: userInfo.bzhu
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="公司介绍" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.gsjieshao :
                                getFieldDecorator('gsjieshao', {
                                    initialValue: userInfo.gsjieshao
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="项目介绍" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.xmjieshao :
                                getFieldDecorator('xmjieshao', {
                                    initialValue: userInfo.xmjieshao
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="项目荣誉" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.xmrongyu :
                                getFieldDecorator('xmrongyu', {
                                    initialValue: userInfo.xmrongyu
                                })(
                                    <TextArea type="text" maxlength="150" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="IMDb指数" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.imdbzs :
                                getFieldDecorator('imdbzs', {
                                    initialValue: userInfo.imdbzs
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                </Form>
            );
        }
    }
}
UserForm = Form.create({})(UserForm);