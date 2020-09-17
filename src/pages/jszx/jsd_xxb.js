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
export default class jsd_xxb extends React.Component {
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
            ['月费信息及收入分成', '', '', '', '', '', '', '', '', '', '', '','','','','',],
            ['合作产品名ProjectName', '中文产品名ProjectName- CN', '月份 Month', '小米 xiaomi', '爱奇艺 iQiyi', '优酷 YouKu', '腾讯 Tencent', '咪咕 Migu', '海信 Hisense','创维 Skyworth','B站 bilibili','长虹 changhong','华为 huawei' ,'CP分成 CP split', '实际结算款 Settlement', '预付金 MG']
        ]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `结算单（详细版）.xlsx`)
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
        axios.get("http://118.31.45.118:8888/lvyou-ssm1/jsdxiangxib?id=" + params.id + "&time1=" + params.time1+ "&time2=" + params.time2,
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
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/jsdxiangxib?id=4&time1=2019-09&time2=2019-12',
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
    // 动态表头
    //    request = ()=>{
    //        axios.ajax({
    //         url: '/lvyou-ssm/btce',
    //        }).then((res)=>{
    //         //    console.log(JSON.stringify(res));
    //             this.setState({
    //                 dataSource2:res
    //             })
    //             console.log(res);
    //        }) 
    //    }  
    render() {
        const columns = [
            {
                title: '月信息费及收入分成',
                width: 120,
                dataIndex: 'id',
                children:
                    [
                        {
                            title: '合作产品名ProjectName',
                            dataIndex: 'pnames',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '中文产品名ProjectName- CN',
                            dataIndex: 'pname',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '月份 Month',
                            dataIndex: 'riqi',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '小米 xiaomi',
                            dataIndex: 'xiaomi',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '爱奇艺 iQiyi',
                            dataIndex: 'aiqiyi',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '优酷 YouKu',
                            dataIndex: 'youku',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '腾讯 Tencent',
                            dataIndex: 'tengxun',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '咪咕 Migu',
                            dataIndex: 'migu',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '海信 Hisense',
                            dataIndex: 'haixin',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title:'创维 Skyworth',
                            dataIndex: 'chuangwei',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: 'B站 bilibili',
                            dataIndex: 'bzhan',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '长虹 changhong',
                            dataIndex: 'changhong',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '华为 huawei' ,
                            dataIndex: 'huawei',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: 'CP分成 CP split',
                            dataIndex: 'fencheng',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '实际结算款 Settlement',
                            dataIndex: 'sjjsk',
                            width: 120,
                            ellipsis:true,
                        },
                        {
                            title: '预付金 MG',
                            dataIndex: 'yufujin',
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
                <FormItem label="合作产品名ProjectName" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pnames :
                            getFieldDecorator('pnames', {
                                initialValue: userInfo.pnames
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="中文产品名ProjectName- CN" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.pname :
                            getFieldDecorator('pname', {
                                initialValue: userInfo.pname
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="月份 Month" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.riqi :
                            getFieldDecorator('riqi', {
                                initialValue: userInfo.riqi
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="小米 xiaomi" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.xiaomi :
                            getFieldDecorator('xiaomi', {
                                initialValue: userInfo.xiaomi
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="爱奇艺 iQiyi" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.aiqiyi :
                            getFieldDecorator('aiqiyi', {
                                initialValue: userInfo.aiqiyi
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="优酷 YouKu" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.youku :
                            getFieldDecorator('youku', {
                                initialValue: userInfo.youku
                            })(
                                <TextArea type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="腾讯 Tencent" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.tengxun :
                            getFieldDecorator('tengxun', {
                                initialValue: userInfo.tengxun
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="咪咕 Migu" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.migu :
                            getFieldDecorator('migu', {
                                initialValue: userInfo.migu
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="海信 Hisense" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.haixin :
                            getFieldDecorator('haixin', {
                                initialValue: userInfo.haixin
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="创维 Skyworth" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.chuangwei:
                            getFieldDecorator('chuangwei', {
                                initialValue: userInfo.chuangwei
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="B站 bilibili" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.bzhan :
                            getFieldDecorator('bzhan', {
                                initialValue: userInfo.bzhan
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="长虹 changhong" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.changhong :
                            getFieldDecorator('changhong', {
                                initialValue: userInfo.changhong
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="华为 huawei" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.huawei :
                            getFieldDecorator('huawei', {
                                initialValue: userInfo.huawei
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="CP分成 CP split" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.fencheng :
                            getFieldDecorator('fencheng', {
                                initialValue: userInfo.fencheng
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="实际结算款 Settlement" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.sjjsk :
                            getFieldDecorator('sjjsk', {
                                initialValue: userInfo.sjjsk
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="预付金 MG" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.yufujin :
                            getFieldDecorator('yufujin', {
                                initialValue: userInfo.yufujin
                            })(
                                <Input type="text" placeholder="" />
                            )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        type == 'detail' ? userInfo.beizhu :
                            getFieldDecorator('beizhu', {
                                initialValue: userInfo.beizhu
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