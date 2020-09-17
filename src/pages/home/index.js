import React from "react";
import "./index.less";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Modal, Button, Input, message, Form, Checkbox } from "antd";
let list;
export default class Home extends React.Component {
  render() {
    return (
      <div className="home-wrap">
        <div class="dog"></div>

        <div class="texto">
          <h1>欢迎使用汇火视频数据管理系统</h1>
        </div>
        <div class="dog"></div>
      </div>
    );
  }
  componentDidMount() {
    axios
      .get("http://118.31.45.118:8888/lvyou-ssm1/logintype", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
        } else {
          this.props.history.push("/common/dengluye");
        }
      });
  }
}
