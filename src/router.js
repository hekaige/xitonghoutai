import React from 'react'
import { HashRouter, Route,Switch,Redirect } from 'react-router-dom'
import PrivateRouter from "./components/privateRouter/index";
import App from './App'
import Admin from './admin';
import Yhgl from './pages/zhgl/yhgl'
import jsgl from './pages/zhgl/jsgl'
import cpxxk from './pages/sjlr/cpxxk'
import spjcxxk from './pages/sjlr/spjcxxk'
import qdxxk from './pages/sjlr/qdxxk'
import qqdxxk from './pages/sjlr/qqdxxk'
import dqdxxk from './pages/sjlr/dqdxxk'
import yysjrb from './pages/sjlr/yysjrb'
import yysjyb from './pages/sjlr/yysjyb'
import Common from './common'
import pie from './pages/echarts/pie/bingtu'
import pie2 from './pages/echarts/pie/bingtu2'
import pie3 from './pages/echarts/pie/bingtu3'
import pie4 from './pages/echarts/pie/bingtu4'
import pie5 from './pages/echarts/pie/bingtu5'
import line from './pages/echarts/line/index'
import line2 from './pages/echarts/line/line2'
import line3 from './pages/echarts/line/line3'
import dengluye from './pages/dengluye/index'
import srsjrb from './pages/sjlr/srsjrb';
import srsjyb from './pages/sjlr/srsjyb';
import gspyysjmxrb from './pages/bbzx/gspyysjmxrb';
import gspyysjmxyb from './pages/bbzx/gspyysjmxyb';
import dspqqdyysjhz from './pages/bbzx/dspqqdyysjhz';
import qspqqdyysjhz from './pages/bbzx/qspqqdyysjhz';
import dspsrsjmxrb from './pages/bbzx/dspsrsjmxrb';
import dspsrsjmxyb from './pages/bbzx/dspsrsjmxyb';
import dspgqdsrhz from './pages/bbzx/dspgqdsrhz';
import qspsrhz from './pages/bbzx/qspsrhz';
import dqdspnrsrmx from './pages/bbzx/dqdspnrsrmx';
import qqdsrhz from './pages/bbzx/qqdsrhz';
import qqdhzslhz from './pages/bbzx/qqdhzslhz';
import jsd_jyb from './pages/jszx/jsd_jyb';
import jsd_xxb from './pages/jszx/jsd_xxb';
import Home from './pages/home';
import NoAuth from './components/NoAuth'
import dqyh from './pages/zhgl/dqyh';
import qshipinqqdyisjhzxxb from './pages/bbzx/qshipinqqdyisjhzxxb';
import quanxianweikaiqi from './components/NoAuth/quanxianweikaiqi';
export default class IRouter extends React.Component {

    render() {
        return (
            <HashRouter>
                <App>
                    <Route path="/admin"  render={() =>
                        <Admin>
                            <Switch>
                                <PrivateRouter path="/admin/home" component={Home} roles={'admin'} />
                                <PrivateRouter path="/admin/zhgl/yhgl" component={Yhgl} />
                                <PrivateRouter path="/admin/zhgl/dqyh" component={dqyh} />
                                <PrivateRouter path="/admin/zhgl/jsgl" component={jsgl} />
                                <PrivateRouter path="/admin/sjlr/cpxxk" component={cpxxk} />
                                <PrivateRouter path="/admin/sjlr/spjcxxk" component={spjcxxk} />
                                <PrivateRouter path="/admin/sjlr/qdxxk" component={qdxxk} />
                                <PrivateRouter path="/admin/sjlr/qqdxxk" component={qqdxxk} />
                                <PrivateRouter path="/admin/sjlr/dqdxxk" component={dqdxxk} />
                                <PrivateRouter path="/admin/sjlr/yysjrb" component={yysjrb} />
                                <PrivateRouter path="/admin/sjlr/yysjyb" component={yysjyb} />
                                <PrivateRouter path="/admin/sjlr/srsjrb" component={srsjrb} />
                                <PrivateRouter path="/admin/sjlr/srsjyb" component={srsjyb} />
                                <PrivateRouter path="/admin/bbzx/gspyysjmxrb" component={gspyysjmxrb} />
                                <PrivateRouter path="/admin/bbzx/gspyysjmxyb" component={gspyysjmxyb} />
                                <PrivateRouter path="/admin/bbzx/dspqqdyysjhz" component={dspqqdyysjhz} />
                                <PrivateRouter path="/admin/bbzx/qspqqdyysjhz" component={qspqqdyysjhz} />
                                <PrivateRouter path="/admin/bbzx/qshipinqqdyisjhzxxb" component={qshipinqqdyisjhzxxb} />
                                <PrivateRouter path="/admin/bbzx/dspsrsjmxrb" component={dspsrsjmxrb} />
                                <PrivateRouter path="/admin/bbzx/dspsrsjmxyb" component={dspsrsjmxyb} />
                                <PrivateRouter path="/admin/bbzx/dspgqdsrhz" component={dspgqdsrhz} />
                                <PrivateRouter path="/admin/bbzx/qspsrhz" component={qspsrhz} />
                                <PrivateRouter path="/admin/bbzx/dqdspnrsrmx" component={dqdspnrsrmx} />
                                <PrivateRouter path="/admin/bbzx/qqdsrhz" component={qqdsrhz} />
                                <PrivateRouter path="/admin/bbzx/qqdhzslhz" component={qqdhzslhz} />
                                <PrivateRouter path="/admin/jszx/jsd_jyb" component={jsd_jyb} />
                                <PrivateRouter path="/admin/jszx/jsd_xxb" component={jsd_xxb} />
                                <Route path="/admin/NoAuth" component={NoAuth} />
                                <Route path="/admin/quanxianweikaiqi" component={quanxianweikaiqi} />
                            </Switch>
                        </Admin>
                    } />
                    <Route path="/common" render={() =>
                        <Common>
                            <Route path="/common/order/detail/:orderId" component={pie} />
                            <Route path="/common/order/detail2/:orderId2" component={line} />
                            <Route path="/common/order/detail3/:orderId3" component={line2} />
                            <Route path="/common/order/detail4/:orderId4" component={line3} />
                            <Route path="/common/order/detail5/:orderId5" component={pie2} />
                            <Route path="/common/order/detail6/:orderId6" component={pie3} />
                            <Route path="/common/order/detail7/:orderId7" component={pie4} />
                            <Route path="/common/order/detail8/:orderId8" component={pie5} />
                            <Route path="/common/dengluye" component={dengluye} />
                        </Common>
                    } />
                </App>
            </HashRouter>
        );
    }
}