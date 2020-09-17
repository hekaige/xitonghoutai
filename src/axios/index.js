import JsonP from 'jsonp' 
import axios from 'axios'
import { Modal } from 'antd';
import Utils from './../utils/utils'
export default class Axios{
    static requestList2(_this,url,params,isMock){   //查询请求列表
        var data = {
            params: params,
            isMock
        }
        this.ajax({
            url:url,
            data:data
        }).then((data)=>{
            if (data && data.result){
                let list = data.result.item_list.map((item, index) => {
                    item.key = index;
                    return item;
                });
                _this.setState({
                    list:list,
                    // pagination: Utils.pagination(data, (current) => {
                    //     _this.params.page = current;
                    //     _this.requestList2();
                    // })
                })
            }
        });
    }
    static jsonp(options){
       return new Promise((resolve,reject)=>{
            JsonP(options.url,{
                param:'callback'
            },function (err,response) {
                if(response.status == 'success'){
                    resolve(response);
                }else{
                    reject(response.messsage);
                }
            })
        })
    }
    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block'
        }
        let baseApi = '';
        if(options.isMock){
            baseApi = 'http://118.31.45.118:8888/';
        }else{
            baseApi = 'http://118.31.45.118:8888/';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:5000,
                param:( options.data && options.data.param) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    resolve(res);
                    return;
                    if (res.code == '0'){
                        
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}