import React from 'react'
import { Card, Button, Form, Select, Modal, Input, TreeSelect, Tree, Transfer, message } from 'antd'
import ETable from './../../components/ETable'
import Utils from './../../utils/utils'
import axios from 'axios'
import menuConfig from './../../config/menuConfig'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
let list
let dangqianquanxian
let hhh
export default class jsql extends React.Component {
    state = {
        rderIonfo: {},
        list: [],
        isShowOpenCity: false,
        orderConfirmVisble: false,
        dangqianquanxian:[]
    }
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //默认请求接口数据
    requestList = () => {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/juese',
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
        }
        else if (type == 'quanxian') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择角色'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '设置权限',
                userInfo: item
            })
        }
        else if (type == 'dangqianquanxian') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择要查看的内容'
                })
                return;
            }
            let _this = this;
            Modal.confirm({
                title: '确认查看',
                content: '是否要查看当前选中的权限内容',
                onOk() {
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/qxfanhui?id=' + item.id,
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
                            const s = res.data.toString(); 
                            dangqianquanxian= s
                            _this.setState({
                                dangqianquanxian:dangqianquanxian
                            })
                          
                            Modal.success({
                                title: "当前权限",
                            
                            content:(<div>
                                {
                                    res.data.map((item2)=>{
                                    return <p>{item2}</p>
                                    })
                                }
                            </div>) 
                            })
                    }}
                    )
                
                }
            
            })
        }
        else if (type == 'shouquan') {
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择角色'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '用户授权',
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
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/juesesc?id=' + item.id,
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
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        console.log(data);
        let url;
        //新增
        if (data.id == null) {
            if (data.juesename == null || data.juesename == '' || data.juesemiaoshu == null || data.juesemiaoshu == '' || data.sfqiyong == null || data.sfqiyong == '') {
                message.warning('带小红花的是必填项噢！')
            }else{
                url = "http://118.31.45.118:8888/lvyou-ssm1/juesezj?juesename=" + data.juesename + "&juesemiaoshu=" + data.juesemiaoshu + "&sfqiyong=" + data.sfqiyong;
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
           
        } else {
            //设置权限
            if (data.qxname != null) {
                url = "http://118.31.45.118:8888/lvyou-ssm1/juesexg?qxname=" + data.qxname + "&juesename=" + data.juesename;
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
                //用户授权
            }
            else if(data.username!=null){
                url = "http://118.31.45.118:8888/lvyou-ssm1/yhshouquan?juesename=" + data.juesename + "&username=" + data.username;
                encodeURI(url)
                axios.get(url,
                    {
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
                    if (res != undefined) {
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                        this.requestList();
                    }
                }})
            } 
            //编辑
            else {
                if (data.juesename == null || data.juesename == '' || data.juesemiaoshu == null || data.juesemiaoshu == '' || data.sfqiyong == null || data.sfqiyong == '') {
                    message.warning('带小红花的是必填项噢！')
                }else{
                    url = "http://118.31.45.118:8888/lvyou-ssm1/juesezj?id=" + data.id + "&juesename=" + data.juesename + "&juesemiaoshu=" + data.juesemiaoshu + "&sfqiyong=" + data.sfqiyong;
                    encodeURI(url)
                    axios.get(url,
                        {
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
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                ellipsis: true,
            }, {
                title: '角色名称',
                dataIndex: 'juesename',
                ellipsis: true,
            }, {
                title: '角色描述',
                dataIndex: 'juesemiaoshu',
                ellipsis: true,
            }, {
                title: '是否启用',
                dataIndex: 'sfqiyong',
                ellipsis: true,
            }, {
                title: '操作时间',
                dataIndex: 'cztime',
                ellipsis: true,
            }, {
                title: '操作人',
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
                <Card className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('create')}>新增</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>编辑</Button>
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('quanxian')}>设置权限</Button>
                    <Button type="primary" icon="eye" onClick={() => this.hanleOperate('dangqianquanxian')}>当前权限</Button>
                    <Button type="primary" icon="plus" onClick={() => this.hanleOperate('shouquan')}>用户授权</Button>
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
                        scroll={{ x: 720 }}
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
//  const { SHOW_PARENT } = TreeSelect;
const treeData = [
    {
        title: '账号管理',
        value: '账号管理',
        key: '账号管理',
        children: [
            {
                title: '用户管理',
                value: '用户管理',
                key: '用户管理',
                children: [
                    {
                        title: '用户列表',
                        value: '用户列表',
                        key: '用户列表',

                    },
                    {
                        title: '用户内部增加、修改',
                        value: '用户内部增加、修改',
                        key: '用户内部增加、修改',

                    },
                    {
                        title: '用户外部增加',
                        value: '用户外部增加',
                        key: '用户外部增加',

                    },
                    {
                        title: '用户删除',
                        value: '用户删除',
                        key: '用户删除',

                    },
                    {
                        title: '用户查询',
                        value: '用户查询',
                        key: '用户查询',
                    },
                ]
            },
            {
                title: '角色管理',
                value: '角色管理',
                key: '角色管理',
                children: [
                    {
                        title: '角色列表',
                        value: '角色列表',
                        key: '角色列表',

                    },
                    {
                        title: '角色增加、修改',
                        value: '角色增加、修改',
                        key: '角色增加、修改',

                    },
                    {
                        title: '角色删除',
                        value: '角色删除',
                        key: '角色删除',

                    },
                    {
                        title: '权限编辑',
                        value: '权限编辑',
                        key: '权限编辑',

                    },
                    {
                        title: '用户授权',
                        value: '用户授权',
                        key: '用户授权',

                    },
                ]
            },
        ],
    },
    {
        title: '数据录入',
        value: '数据录入',
        key: '数据录入',
        children: [
            {
                title: 'CP信息库',
                value: 'CP信息库',
                key: 'CP信息库',
                children: [
                    {
                        title: 'cpxx展示',
                        value: 'cpxx展示',
                        key: 'cpxx展示',
                    },
                    {
                        title: 'cpxx查询',
                        value: 'cpxx查询',
                        key: 'cpxx查询',
                    },
                    {
                        title: 'cpxx增加、修改',
                        value: 'cpxx增加、修改',
                        key: 'cpxx增加、修改',
                    },
                    {
                        title: 'cpxx删除',
                        value: 'cpxx删除',
                        key: 'cpxx删除',
                    },
                ],
            },
            {
                title: '视频基础信息库',
                value: '视频基础信息库',
                key: '视频基础信息库',
                children: [
                    {
                        title: '视频信息展示',
                        value: '视频信息展示',
                        key: '视频信息展示',
                    },
                    {
                        title: '视频信息查询',
                        value: '视频信息查询',
                        key: '视频信息查询',
                    },
                    {
                        title: '视频信息引入增加、修改',
                        value: '视频信息引入增加、修改',
                        key: '视频信息引入增加、修改',
                    },
                    {
                        title: '视频信息运营增加、修改',
                        value: '视频信息运营增加、修改',
                        key: '视频信息运营增加、修改',
                    },
                    {
                        title: '视频信息删除',
                        value: '视频信息删除',
                        key: '视频信息删除',
                    },
                ],
            },
            {
                title: '渠道信息库',
                value: '渠道信息库',
                key: '渠道信息库',
                children: [
                    {
                        title: '渠道信息展示',
                        value: '渠道信息展示',
                        key: '渠道信息展示',
                    },
                    {
                        title: '渠道信息查询',
                        value: '渠道信息查询',
                        key: '渠道信息查询',
                    },
                    {
                        title: '渠道信息增加、修改',
                        value: '渠道信息增加、修改',
                        key: '渠道信息增加、修改',
                    },
                    {
                        title: '渠道信息删除',
                        value: '渠道信息删除',
                        key: '渠道信息删除',
                    },
                ],
            },
            {
                title: '全渠道信息库',
                value: '全渠道信息库',
                key: '全渠道信息库',
                children: [
                    {
                        title: '全渠道信息库展示',
                        value: '全渠道信息库展示',
                        key: '全渠道信息库展示',
                    }
                ],
            },
            {
                title: '单渠道信息库',
                value: '单渠道信息库',
                key: '单渠道信息库',
                children: [
                    {
                        title: '单渠道信息库展示',
                        value: '单渠道信息库展示',
                        key: '单渠道信息库展示',
                    },
                    {
                        title: '单渠道信息库查询',
                        value: '单渠道信息库查询',
                        key: '单渠道信息库查询',
                    },
                    {
                        title: '单渠道信息库增加、修改',
                        value: '单渠道信息库增加、修改',
                        key: '单渠道信息库增加、修改',
                    },
                    {
                        title: '单渠道信息库删除',
                        value: '单渠道信息库删除',
                        key: '单渠道信息库删除',
                    },
                ],
            },
            {
                title: '运营数据日表',
                value: '运营数据日表',
                key: '运营数据日表',
                children: [
                    {
                        title: '运营数据日表展示',
                        value: '运营数据日表展示',
                        key: '运营数据日表展示',
                    },
                    {
                        title: '运营数据日表导入',
                        value: '运营数据日表导入',
                        key: '运营数据日表导入',
                    },
                    {
                        title: '运营数据日表查询',
                        value: '运营数据日表查询',
                        key: '运营数据日表查询',
                    },
                    {
                        title: '运营数据日表增加、修改',
                        value: '运营数据日表增加、修改',
                        key: '运营数据日表增加、修改',
                    },
                    {
                        title: '运营数据日表删除',
                        value: '运营数据日表删除',
                        key: '运营数据日表删除',
                    },
                ],
            },
            {
                title: '运营数据月表',
                value: '运营数据月表',
                key: '运营数据月表',
                children: [
                    {
                        title: '运营数据月表导入',
                        value: '运营数据月表导入',
                        key: '运营数据月表导入',
                    },
                    {
                        title: '运营数据月表展示',
                        value: '运营数据月表展示',
                        key: '运营数据月表展示',
                    },
                    {
                        title: '运营数据月表查询',
                        value: '运营数据月表查询',
                        key: '运营数据月表查询',
                    },
                    {
                        title: '运营数据月表增加、修改',
                        value: '运营数据月表增加、修改',
                        key: '运营数据月表增加、修改',
                    },
                    {
                        title: '运营数据月表删除',
                        value: '运营数据月表删除',
                        key: '运营数据月表删除',
                    },
                ],
            },
            {
                title: '收入数据日表',
                value: '收入数据日表',
                key: '收入数据日表',
                children: [
                    {
                        title: '收入数据日表展示',
                        value: '收入数据日表展示',
                        key: '收入数据日表展示',
                    },
                    {
                        title: '收入数据日表导入',
                        value: '收入数据日表导入',
                        key: '收入数据日表导入',
                    },
                    {
                        title: '收入数据日表查询',
                        value: '收入数据日表查询',
                        key: '收入数据日表查询',
                    },
                    {
                        title: '收入数据日表增加、修改',
                        value: '收入数据日表增加、修改',
                        key: '收入数据日表增加、修改',
                    },
                    {
                        title: '收入数据日表删除',
                        value: '收入数据日表删除',
                        key: '收入数据日表删除',
                    },
                ],
            },
            {
                title: '收入数据月表',
                value: '收入数据月表',
                key: '收入数据月表',
                children: [
                    {
                        title: '收入数据月表展示',
                        value: '收入数据月表展示',
                        key: '收入数据月表展示',
                    },
                    {
                        title: '收入数据月表导入',
                        value: '收入数据月表导入',
                        key: '收入数据月表导入',
                    },
                    {
                        title: '收入数据月表查询',
                        value: '收入数据月表查询',
                        key: '收入数据月表查询',
                    },
                    {
                        title: '收入数据月表增加、修改',
                        value: '收入数据月表增加、修改',
                        key: '收入数据月表增加、修改',
                    },
                    {
                        title: '收入数据月表删除',
                        value: '收入数据月表删除',
                        key: '收入数据月表删除',
                    },
                ],
            },
        ],
    },
    {
        title: '报表中心',
        value: '报表中心',
        key: '报表中心',
        children: [
            {
                title: '各视频运营数据明细日表',
                value: '各视频运营数据明细日表',
                key: '各视频运营数据明细日表',
            },
            {
                title: '各视频运营数据明细月表',
                value: '各视频运营数据明细月表',
                key: '各视频运营数据明细月表',
            },
            {
                title: '单视频全渠道运营数据汇总',
                value: '单视频全渠道运营数据汇总',
                key: '单视频全渠道运营数据汇总',
            },
            {
                title: '全视频全渠道运营汇总详细版',
                value: '全视频全渠道运营汇总详细版',
                key: '全视频全渠道运营汇总详细版',
            },
            {
                title: '全视频全渠道运营汇总',
                value: '全视频全渠道运营汇总',
                key: '全视频全渠道运营汇总',
            },

            {
                title: '单视频收入数据明细日表',
                value: '单视频收入数据明细日表',
                key: '单视频收入数据明细日表',
            },
            {
                title: '单视频收入数据明细月表',
                value: '单视频收入数据明细月表',
                key: '单视频收入数据明细月表',
            },
            {
                title: '单视频各渠道收入汇总',
                value: '单视频各渠道收入汇总',
                key: '单视频各渠道收入汇总',
            },
            {
                title: '全视频收入汇总',
                value: '全视频收入汇总',
                key: '全视频收入汇总',
            },
            {
                title: '单渠道视频内容收入明细',
                value: '单渠道视频内容收入明细',
                key: '单渠道视频内容收入明细',
            },
            {
                title: '全渠道收入汇总',
                value: '全渠道收入汇总',
                key: '全渠道收入汇总',
            },
            {
                title: '全渠道合作数量汇总',
                value: '全渠道合作数量汇总',
                key: '全渠道合作数量汇总',
            },
        ],
    },
    {
        title: '结算中心',
        value: '结算中心',
        key: '结算中心',
        children: [
            {
                title: '结算单简约版',
                value: '结算单简约版',
                key: '结算单简约版',
            },
            {
                title: '结算单详细版',
                value: '结算单详细版',
                key: '结算单详细版',
            }
        ],
    },
];
class UserForm extends React.Component {//栅格结构
    state = {
        value: ['0-0-0'],
        mockData: [],
        targetKeys: [],
    };
    componentDidMount() {
        // this.getMock();
        this.dongtaiyonghubiao()
    }
    onChange = value => {
        console.log('onChange ', value);
        this.setState({ value });
    };
     //动态用户表穿梭框里的
     dongtaiyonghubiao = () => {
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/yonghu",
        {
            withCredentials: true
        }
        )
            .then((res) => {
                let form = this.state.mockData;
                form = res.data.username
                this.setState(
                    {
                        mockData: form,
                    },
                    () => {
                        console.log(this.state.mockData);
                    }
                );
            });
    };
    getMock = () => {
        const targetKeys = [];
        const mockData = [
            {
                key: "贺凯歌",
                title: "贺凯歌",
            },
            {
                key: "刘德华",
                title: "刘德华",
            },
        ];
        // for (let i = 0; i < 20; i++) {
        //     const data = {
        //         key: "贺凯歌",
        //         title: "贺凯歌",
        //     };
        //     if (data.chosen) {
        //         targetKeys.push(data.key);
        //     }
        //     mockData.push(data);
        // }
        this.setState({ mockData, targetKeys });
    };

    // filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };
    render() {

        const tProps = {
            treeData,
            value: this.state.value,
            // onChange: this.onChange,
            treeCheckable: true,
            // showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '',
            style: {
                width: '100%',
            },
        };
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
        if (type == 'shouquan') {
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
                     <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename,

                                })(
                                    <Input type="text" maxlength="20" placeholder="" disabled="disabled" />
                                )
                        }
                    </FormItem>
                    <FormItem label="选择用户" {...formItemLayout}>
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
                                <Transfer
                                    dataSource={this.state.mockData}
                                    showSearch
                                    filterOption={this.filterOption}
                                    targetKeys={this.state.targetKeys}
                                    onChange={this.handleChange}
                                    onSearch={this.handleSearch}
                                    render={item => item.title}
                                />
                            )
                    }
                </FormItem>
                </Form>
                
            )
        }
        if (type == 'quanxian') {
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
                    <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename,

                                })(
                                    <Input type="text" maxlength="20" placeholder="" disabled="disabled" />
                                )
                        }
                    </FormItem>
                    {/* <FormItem label="角色描述" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesemiaoshu :
                                getFieldDecorator('juesemiaoshu', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesemiaoshu
                                })
                                    (
                                        <Input type="text" maxlength="20" placeholder="" disabled="disabled" />
                                    )
                        }
                    </FormItem> */}
                    <FormItem label="角色权限" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.qxname :
                                getFieldDecorator('qxname', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    initialValue: userInfo.qxname
                                })
                                    (
                                        <TreeSelect {...tProps} />
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
                                    initialValue: userInfo.sfqiyong,

                                })(
                                    <Select disabled="disabled">
                                        {Utils.getOptionList([{ id: '是', name: '是' }, { id: '否', name: '否' },])}
                                    </Select>
                                )
                        }
                    </FormItem>
                </Form>
            );
        } else {
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
                    <FormItem label="角色名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesename :
                                getFieldDecorator('juesename', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesename,

                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="角色描述" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.juesemiaoshu :
                                getFieldDecorator('juesemiaoshu', {
                                    rules: [{
                                        required: true,
                                        message: '不能为空'
                                    }],
                                    validateTrigger: ['onBlur', 'onChange'],
                                    initialValue: userInfo.juesemiaoshu
                                })
                                    (
                                        <Input type="text" maxlength="20" placeholder="" />
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
                                        {Utils.getOptionList([{ id: '是', name: '是' }, { id: '否', name: '否' },])}
                                    </Select>
                                )
                        }
                    </FormItem>
                </Form>
            );
        }
    }
}

UserForm = Form.create({})(UserForm);

// class RoleForm extends React.Component {//栅格结构
//     render() {
//         let type = this.props.type;
//         let userInfo;
//         const { getFieldDecorator } = this.props.form;
//         const formItemLayout = {
//             labelCol: { span: 5 },
//             wrapperCol: { span: 19 }
//         }
//         return (
//             <Form layout="horizontal">
//                 <FormItem label="角色名称" {...formItemLayout}>
//                     {   
//                         getFieldDecorator('juesename', {
//                             rules: [{
//                                 required: true,
//                                 message: '不能为空'
//                             }],
//                             validateTrigger: ['onBlur', 'onChange'],
//                         })(
//                             <Input type="text" placeholder="请输入角色名称" />
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="角色描述" {...formItemLayout}>
//                     {
//                         getFieldDecorator('juesemiaoshu', {
//                             rules: [{
//                                 required: true,
//                                 message: '不能为空'
//                             }],
//                             validateTrigger: ['onBlur', 'onChange'],
//                         })(
//                             <Input type="text" placeholder="请输入角色描述" />
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="是否启用" {...formItemLayout}>
//                     {
//                         getFieldDecorator('sfqiyong', {
//                             rules: [{
//                                 required: true,
//                                 message: '不能为空'
//                             }],
//                             validateTrigger: ['onBlur', 'onChange'],
//                         })(
//                             <Select>
//                                 <Option value={"是"}>是</Option>
//                                 <Option value={"否"}>否</Option>
//                             </Select>
//                         )
//                     }
//                 </FormItem>
//             </Form>
//         );
//     }
// }
// RoleForm = Form.create({})(RoleForm);

// class PermEditForm extends React.Component {

//     onCheck = (checkedKeys) => {
//         this.props.patchMenuInfo(checkedKeys)
//     }
// //权限树加载
//     renderTreeNodes = (data) => {
//         return data.map((item) => {
//             if (item.children) {
//                 return <TreeNode title={item.title} key={item.key}>
//                     {this.renderTreeNodes(item.children)}
//                 </TreeNode>
//             } else {
//                 return <TreeNode {...item} />
//             }
//         })
//     }
//     render() {
//         const { getFieldDecorator } = this.props.form;
//         const formItemLayout = {
//             labelCol: { span: 5 },
//             wrapperCol: { span: 19 }
//         }
//         const detail_info = this.props.detailInfo;
//         const menuInfo = this.props.menuInfo;
//         return (
//             <Form layout="horizontal">
//                 <FormItem label="角色名称" {...formItemLayout}>
//                     <Input disabled placeholder={detail_info.role_name} />
//                 </FormItem>
//                 <FormItem label="角色描述" {...formItemLayout}>
//                     {
//                         getFieldDecorator('role_name')(
//                             <Input type="text" placeholder="" />
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="是否启用" {...formItemLayout}>
//                     {
//                         getFieldDecorator('status', {
//                             initialValue: '1'
//                         })(
//                             <Select>
//                                 <Option value="1">是</Option>
//                                 <Option value="0">否</Option>
//                             </Select>
//                         )
//                     }
//                 </FormItem>
//                 <Tree
//                     checkable //复选框
//                     defaultExpandAll //默认展开
//                     onCheck={(checkedKeys) => {
//                         this.onCheck(checkedKeys)
//                     }}
//                     checkedKeys={menuInfo}
//                 >
//                     <TreeNode title="权限" key="platform_all">
//                         {this.renderTreeNodes(menuConfig)}
//                     </TreeNode>
//                 </Tree>
//             </Form>
//         );
//     }
// }
// PermEditForm = Form.create({})(PermEditForm);

// class RoleAuthForm extends React.Component {

//     onCheck = (checkedKeys) => {
//         this.props.patchMenuInfo(checkedKeys)
//     }
//     filterOption = (inputValue, option) => {
//         return option.title.indexOf(inputValue) > -1;
//     }
//     //选择数据源
//     handleChange = (targetKeys) => {
//         this.props.patchUserInfo(targetKeys);
//     }

//     render() {
//         const { getFieldDecorator } = this.props.form;
//         const formItemLayout = {
//             labelCol: { span: 5 },
//             wrapperCol: { span: 19 }
//         }
//         const detail_info = this.props.detailInfo;
//         const menuInfo = this.props.menuInfo;
//         return (
//             <Form layout="horizontal">
//                 <FormItem label="角色名称" {...formItemLayout}>
//                     <Input disabled placeholder={detail_info.role_name} />
//                 </FormItem>
//                 <FormItem label="选择用户" {...formItemLayout}>
//                     <Transfer
//                         listStyle={{ width: 200, height: 400 }}
//                         dataSource={this.props.mockData}//数据源
//                         titles={['待选用户', '已选用户']}
//                         showSearch//搜索
//                         searchPlaceholder='输入用户名'
//                         filterOption={this.filterOption}//过滤
//                         targetKeys={this.props.targetKeys}//目标源
//                         onChange={this.handleChange}
//                         render={item => item.title}
//                     />
//                 </FormItem>
//             </Form>
//         );
//     }
// }
// RoleAuthForm = Form.create({})(RoleAuthForm);

