import React from 'react'
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker, Cascader } from 'antd'
import Utils from '../../utils/utils';
import axios from './../../axios/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isopen: false,
          time: null,
        };
      }
    
      // 弹出日历和关闭日历的回调
      handleOpenChange = status => {
        // console.log(status)
        if (status) {
          this.setState({ isopen: true });
        } else {
          this.setState({ isopen: false });
        }
      };
    
      //得到 value 并处理
      handlePanelChange = value => {
        // console.log(">>>>>", value)
        //处理 value 操作
        //...
        //设置 isopen
        this.setState({
          isopen: false,
        });
      };
    
      //清除输入框中的值，点击控件的 x ，清除值操作
      clearValue = () => {
        this.setState({      
          time: null,
        })  
      };
    state = {
        shipinmingcheng: [],
        options: [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                                value: 'xihu',
                                label: 'West Lake',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                    {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                                value: 'zhonghuamen',
                                label: 'Zhong Hua Men',
                            },
                        ],
                    },
                ],
            },
        ]
    };
    //动态表单
    dongtaibiaodan = () => {
        axios.ajax({
            url: "/lvyou-ssm1/ceshisss",
        })
            .then((res) => {
                let form = this.state.options;
                form = res.options
                this.setState(
                    {
                        options: form,
                    },
                    () => {
                        console.log(this.state.options);
                    }
                );
            });
    };
    handleFilterSubmit = () => {
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.filterSubmit(fieldsValue);
    }
    handleFilterSubmit2 = () => {
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.filterSubmit2(fieldsValue);
    }
    reset = () => {
        this.props.form.resetFields();
    }
    
    initFormList = () => {
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        if (formList && formList.length > 0) {
            formList.forEach((item, i) => {
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                function onChange(value) {
                    console.log(`selected ${value}`);
                }

                function onBlur() {
                    console.log('blur');
                }

                function onFocus() {
                    console.log('focus');
                }

                function onSearch(val) {
                    console.log('search:', val);
                }
                function onChange(value, selectedOptions) {
                    console.log(value, selectedOptions);
                }

                function filter(inputValue, path) {
                    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
                }

                if (item.type == '城市') {

                    const city = <FormItem label="城市" key={field}>
                        {
                            getFieldDecorator('city', {
                                initialValue: '0'
                            })(
                                <Select
                                    style={{ width: 80 }}
                                    placeholder={placeholder}
                                >
                                    {Utils.getOptionList([{ id: '0', name: '全部' }, { id: '1', name: '北京' }, { id: '2', name: '上海' }, { id: '3', name: '天津' }, { id: '4', name: '杭州' }])}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(city)
                } else if (item.type == '时间查询') {
                    const begin_time = <FormItem label="授权期限" key={field}>
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={field}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(end_time)
                }
                else if (item.type == '合作起始') {
                    const begin_time = <FormItem label="合作起始时间" key={field}>
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={field}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(end_time)
                }
                else if (item.type == '时间') {
                    const begin_time = <FormItem label="时间" key={field}>
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={field}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(end_time)
                }
                else if (item.type == 'INPUT') {
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Input type="text" style={{ width: width }} placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                } else if (item.type == 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                } else if (item.type == 'SELECTshuru') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                // filterOption={(input, option) =>
                                //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                // }
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                } else if (item.type == 'SELECTshuru2') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: "汽车小镇"
                            })(
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                // filterOption={(input, option) =>
                                //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                // }
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                }
                else if (item.type == 'lianjixuanze') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue //true | false
                            })(
                                <Cascader
                                    options={this.state.options}
                                    loadData={this.loadData}
                                    onFocus={this.dongtaibiaodan}
                                    placeholder=""
                                    // showSearch={{ filter }}
                                    expandTrigger="hover"
                                />,
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                }
                else if (item.type == 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                valuePropName: 'checked',
                                initialValue: initialValue //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX)
                } else if (item.type == 'DATE') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
                else if (item.type == 'DATE2') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
                else if (item.type == 'DATE3') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
                else if (item.type == '年月日') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
                else if (item.type == '年月') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <MonthPicker showTime={true} placeholder={placeholder} format="YYYY-MM" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
                else if (item.type == '年') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker
                                    value={this.state.time}
                                    open={this.state.isopen}
                                    mode="year"
                                    placeholder="请选择年份"
                                    format="YYYY"
                                    onOpenChange={this.handleOpenChange}
                                    onPanelChange={this.handlePanelChange}
                                    onChange={this.clearValue}
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }


            })
        }
        return formItemList;
    }
    render() {
        return (
            <Form layout="inline">
                {this.initFormList()}
                <FormItem>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit2}>图表</Button>
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);