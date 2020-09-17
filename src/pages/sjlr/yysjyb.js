import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input, Upload, Icon } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm/index2'
import ETable from './../../components/ETable'
import reqwest from 'reqwest';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class yysjyb extends React.Component {
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
            label: '渠道名称',
            field: 'qdname',
            placeholder: '',
            width: 100,
        },
        {
            type: 'INPUT',
            label: '日期',
            field: 'shijian',
            placeholder: '1994-10-26',
            width: 100,
        },
    ]
    //列表渲染
    componentDidMount() {
        this.requestList();
    }
    //查询
    chaxun = (params) => {
        this.params = params;
        let urls = "";
        if (params.videname == "" && params.qdname == "" && params.shijian == "") {
            message.warning('我们来玩填格子游戏叭~')
            this.requestList();
        } else {
            // if (params.videname != "") {
                urls = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuecx?videname=" + params.videname+"&qdname=" + params.qdname+"&shijian=" + params.shijian;
            // } else if (params.qdname != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuecx?qdname=" + params.qdname;
            // }
            // else if (params.shijian != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuecx?shijian=" + params.shijian;
            // }
            // else if (params.bfliang != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuecx?bfliang=" + params.bfliang;
            // }
            // else if (params.rdu != "") {
            //     urls = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuecx?rdu=" + params.rdu;
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/yyshujuyue',
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
        } else if (type == 'daoru') {
            this.setState({
                type,
                isVisible: true,
                title: '导入',
                userInfo: item,
            })
        }
        else {
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
                    axios.get('http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuesc?id=' + item.id,
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
        if (data.name == null && data.qdao == null && data.qdfl == null) {
            this.userForm.props.form.resetFields();
            this.setState({
                isVisible: false,
            })
            this.requestList();
        } else {
            if (data.name != null && data.qdao != null && data.qdfl != null) {
                this.userForm.props.form.resetFields();    //清除数据
                this.setState({
                    isVisible: false,
                })
                this.requestList();
            } else {
                let url = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuezj?videname=" + data.videname + "&qdname=" + data.qdname + "&shijian=" + data.shijian + "&bfliang=" + data.bfliang + "&gkshij=" + data.gkshij + "&rdu=" + data.rdu + "&bofangzs=" + data.bofangzs + "&qdfl=" + data.qdfl;
                if (data.id != null) {
                    url = "http://118.31.45.118:8888/lvyou-ssm1/yyshujuyuezj?id=" + data.id + "&videname=" + data.videname + "&qdname=" + data.qdname + "&shijian=" + data.shijian + "&bfliang=" + data.bfliang + "&gkshij=" + data.gkshij + "&rdu=" + data.rdu + "&bofangzs=" + data.bofangzs + "&qdfl=" + data.qdfl;
                }
                axios.get(url,
                    {
                        withCredentials: true
                    }
                ).then(res => {
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

    }
    render() {
        const columns = [
            {
                title: '序号',
                width: 120,
                dataIndex: 'id',
                render: (text, record, index) => `${index + 1}`,
                key: 'id',
                ellipsis: true,
            },
            {
                title: '视频名称',
                width: 120,
                dataIndex: 'videname',
                key: 'videname',
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
                title: '日期',
                width: 120,
                dataIndex: 'shijian',
                key: 'shijian',
                ellipsis: true,
            },
            {
                title: '播放量',
                width: 120,
                dataIndex: 'bfliang',
                key: 'bfliang',
                ellipsis: true,
            },
            {
                title: '观看时长（小时）',
                width: 120,
                dataIndex: 'gkshij',
                key: 'gkshij',
                ellipsis: true,
            },
            {
                title: '热度',
                width: 120,
                dataIndex: 'rdu',
                key: 'rdu',
                ellipsis: true,
            },
            {
                title: '播放指数',
                width: 120,
                dataIndex: 'bofangzs',
                key: 'bofangzs',
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
                    {/* <Button type="primary" icon="plus" onClick={()=>this.hanleOperate('create')}>新增</Button> */}
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>编辑</Button>
                    <Button type="primary" icon="eye" onClick={() => this.hanleOperate('detail')}>查看</Button>
                    <Button type="primary" icon="delete" onClick={() => this.hanleOperate('delete')}>删除</Button>
                    <Button type="primary" icon="upload" onClick={() => this.hanleOperate('daoru')}> 导入</Button>
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
                        scroll={{ x: 1200 }, { y: 625 }}
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
    state = {
        fileList: [],
        uploading: false,
    }
    //导入
    handleUpload = () => {
        const data = this.props.form.getFieldsValue()
        const { fileList } = this.state;
        const formData = new FormData();
        formData.append('file', fileList[0]);   //注意第一个参数是传给后台的参数名字，我的项目中叫file1

        this.setState({
            uploading: true,
        });
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/yysjybdrr",
            {
                withCredentials: true
            }).then(res => {
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
                    // You can use any AJAX library you like
                    if (data.name != null && data.qdao != null && data.qdfl != null) {
                        reqwest({
                            url: "http://118.31.45.118:8888/lvyou-ssm1/yysjybdr?name=" + data.name + "&qdao=" + data.qdao + "&qdfl=" + data.qdfl,   //这块是你项目的接口
                            method: 'post',
                            processData: false,
                            withCredentials: true,
                            data: formData,
                            success: () => {
                                this.setState({
                                    fileList: '',
                                    uploading: false,
                                });
                                this.props.form.resetFields();
                                message.success('上传成功.');
                            },
                            error: () => {
                                this.setState({
                                    uploading: false,
                                });
                                message.error('上传失败.');
                            },
                        });
                    } else {
                        this.setState({
                            uploading: false,
                        });
                        message.error('真坏，数据都没写完的嘛')
                    }
                }
            })
    }
    render() {
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        if (type == 'daoru') {
            userInfo = {};
        } else {
            userInfo = this.props.userInfo;
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        if (type == 'daoru') {
            return (
                <Form layout="horizontal">
                    <FormItem label="选择视频名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.name :
                                getFieldDecorator('name', {
                                    initialValue: userInfo.name
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="选择渠道名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.qdao :
                                getFieldDecorator('qdao', {
                                    initialValue: userInfo.qdao
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="选择渠道分类" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.qdfl :
                                getFieldDecorator('qdfl', {
                                    initialValue: userInfo.qdfl
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" /> 选择excel文件
                        </Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={this.handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        {uploading ? '正在上传，请耐心等待' : '点击此按钮上传数据（结束后点击右下角OK刷新表格）'}
                    </Button>
                </Form>
            )
        } else {
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
                    <FormItem label="视频名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.videname :
                                getFieldDecorator('videname', {
                                    initialValue: userInfo.videname
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="渠道名称" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.qdname :
                                getFieldDecorator('qdname', {
                                    initialValue: userInfo.qdname
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="日期" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.shijian :
                                getFieldDecorator('shijian', {
                                    initialValue: userInfo.shijian
                                })(
                                    <Input type="text" maxlength="20" placeholder="2012-02-02" />
                                )
                        }
                    </FormItem>
                    <FormItem label="播放量" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bfliang :
                                getFieldDecorator('bfliang', {
                                    initialValue: userInfo.bfliang
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="观看时长（小时）" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.gkshij :
                                getFieldDecorator('gkshij', {
                                    initialValue: userInfo.gkshij
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="热度" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.rdu :
                                getFieldDecorator('crdu', {
                                    initialValue: userInfo.rdu
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="播放指数" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.bofangzs :
                                getFieldDecorator('bofangzs', {
                                    initialValue: userInfo.bofangzs
                                })(
                                    <Input type="text" maxlength="20" placeholder="" />
                                )
                        }
                    </FormItem>
                    <FormItem label="渠道分类" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.qdfl :
                                getFieldDecorator('qdfl', {
                                    initialValue: userInfo.qdfl
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