import React from 'react';
import { Card, Table, Modal, Button, message, Badge, Form, Select, DatePicker, Radio, Input } from 'antd';
import axios from 'axios';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm'
import ETable from './../../components/ETable'
import XlSX from 'xlsx'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
let list
export default class qqdxxk extends React.Component {
    state = {
        orderInfo: {},
        list: [],
    }
    //导出
    toExcel() {
        const data = [
            ['序号', '视频名称', '爱奇艺', '', '', '', '', '', '优酷', '', '', '', '', '', '腾讯', '', '', '', '', '', '咪咕', '', '', '', '', '', '小米', '', '', '', '', '', '海信', '', '', '', '', '','创维', '', '', '', '', '','B站', '', '', '', '', '','长虹', '', '', '', '', '','华为', '', '', '', '', '',],
            ['', '', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态', '集数', '单集时长', '上线时间', '更新', '模式', '上架状态','集数', '单集时长', '上线时间', '更新', '模式', '上架状态','集数', '单集时长', '上线时间', '更新', '模式', '上架状态','集数', '单集时长', '上线时间', '更新', '模式', '上架状态','集数', '单集时长', '上线时间', '更新', '模式', '上架状态',]
        ]
        for (let i = 0; i < this.state.list.length; i++) {
            data.push(Object.values(this.state.list[i]))
        }
        const ws = XlSX.utils.aoa_to_sheet(data);

        const wb = XlSX.utils.book_new();
        XlSX.utils.book_append_sheet(wb, ws, "sheetJS");
        XlSX.writeFile(wb, `全渠道信息库.xlsx`)
    }
    componentDidMount() {
        this.requestList();
    }
    //默认请求接口数据
    requestList = () => {
        axios.get('http://118.31.45.118:8888/lvyou-ssm1/qqudaokunew',
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
    render() {
        const columns = [
            {
                title: '序号',
                width: 120,
                dataIndex: 'id',
                render: (text, record, index) => `${index + 1}`,
                fixed: 'left',
                ellipsis:true,
            },
            {
                title: '视频名称',
                width: 120,
                dataIndex: 'spname',
                ellipsis:true,
            },
            {
                title: '爱奇艺',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'js',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'danjisc',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsj',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'gxjishu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzms',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjzt',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '优酷',
                width: 120,
                dataIndex: 'cpname',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jishu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djshichan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjs',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjishu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmoshi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjtypes',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '腾讯',
                width: 120,
                dataIndex: 'conty',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jshus',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djshichangs',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxshijian',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjss',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmoshis',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjtype',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '咪咕',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jsmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djscmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjsmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmsmigu',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjztmigu',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '小米',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jsxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djscxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjsxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmsxiaomi',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjztxiaomi',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '海信',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jshaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djschaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjhaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjshaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmshaixin',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjzthaixin',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '创维',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jschuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djscchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjchuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjschuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmschuangwei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjztchuangwei',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: 'B站',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jsbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djscbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjsbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmsbzhan',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjztbzhan',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '长虹',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jschanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djscchanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjchanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjschanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmschanghong',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjztchanghong',
                        width: 120,
                        ellipsis:true,
                    }
                ]
            },
            {
                title: '华为',
                width: 120,
                dataIndex: 'aqy',
                ellipsis:true,
                children: [
                    {
                        title: '集数',
                        dataIndex: 'jshuawei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '单集时长',
                        dataIndex: 'djschuawei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上线时间',
                        dataIndex: 'sxsjhuawei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '更新',
                        dataIndex: 'ygxjshuawei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '模式',
                        dataIndex: 'hzmshuawei',
                        width: 120,
                        ellipsis:true,
                    },
                    {
                        title: '上架状态',
                        dataIndex: 'sjzthuawei',
                        width: 120,
                        ellipsis:true,
                    }
                ]
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

                <Card className="operate-wrap">
                    <Button type="primary" icon="download" onClick={() => this.toExcel()}>导出</Button>
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
                        scroll={{ x: 2000 }}
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
// OpenCityForm = Form.create({})(OpenCityForm);