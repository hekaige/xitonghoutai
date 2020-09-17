import { Icon } from "antd";

const menuList = [
    {
        title: '首页',
        key: '/admin/home'
    },
    {
        title: '账号管理',
        key: '/admin/zhgl',
        children: [
            {
                title: '用户中心',
                key: '',
                children: [
                    {
                        title: '用户管理',
                        key: '/admin/zhgl/yhgl',
                    },
                    {
                        title: '当前用户',
                        key: '/admin/zhgl/dqyh'
                    }
                ]
            },
            {
                title: '角色中心',
                key: '',
                children: [
                    {
                        title: '角色管理',
                        key: '/admin/zhgl/jsgl'
                    }
                ]
            }
        ]
    },
    {
        title: '数据录入',
        key: '/admin/sjlr',
        children: [
            {
                title: 'CP中心',
                key: '',
                children: [
                    {
                        title: 'CP信息库',
                        key: '/admin/sjlr/cpxxk',
                    }
        
                ]
            },
            {
                title: '视频信息',
                key: '',
                children: [
                    {
                        title: '视频基础信息库',
                        key: '/admin/sjlr/spjcxxk',
                    }
                ]
            },
            {
                title: '渠道中心',
                key: '',
                children: [
                    {
                        title: '渠道信息库',
                        key: '/admin/sjlr/qdxxk',
                    }
                ]
            },
            {
                title: '视频上架',
                key: '',
                children: [
                    {
                        title: '全渠道信息库',
                        key: '/admin/sjlr/qqdxxk',
                    },
                    {
                        title: '单渠道信息库',
                        key: '/admin/sjlr/dqdxxk',
                    }
                ]
            },
            {
                title: '运营收入',
                key: '',
                children: [
                    {
                        title: '运营数据日表',
                        key: '/admin/sjlr/yysjrb',
                    },
                    {
                        title: '运营数据月表',
                        key: '/admin/sjlr/yysjyb',
                    },
                    {
                        title: '收入数据日表',
                        key: '/admin/sjlr/srsjrb',
                    },
                    {
                        title: '收入数据月表',
                        key: '/admin/sjlr/srsjyb',
                    }
        
                ]
            }
        ]
    },
    {
        title: '报表中心',
        key: '/admin/bbzx',
        children: [
            {
                title: '视频运营',
                key: '',
                children: [
                    {
                        title: '各视频运营数据明细日表',
                        key: '/admin/bbzx/gspyysjmxrb',
                    },
                    {
                        title: '各视频运营数据明细月表',
                        key: '/admin/bbzx/gspyysjmxyb',
                    },
                    {
                        title: '单视频全渠道运营数据汇总',
                        key: '/admin/bbzx/dspqqdyysjhz',
                    },
                    {
                        title: '全视频全渠道运营数据汇总',
                        key: '/admin/bbzx/qspqqdyysjhz',
                    },
                    {
                        title: '全视频全渠道运营数据汇总（详细版）',
                        key:'/admin/bbzx/qshipinqqdyisjhzxxb'
                    }
                ]
            },
            {
                title: '视频内容收入',
                key: '',
                children: [
                    {
                        title: '单视频收入数据明细日表',
                        key: '/admin/bbzx/dspsrsjmxrb',
                    },
                    {
                        title: '单视频收入数据明细月表',
                        key: '/admin/bbzx/dspsrsjmxyb',
                    },
                    {
                        title: '单视频各渠道收入汇总',
                        key: '/admin/bbzx/dspgqdsrhz',
                    },
                    {
                        title: '全视频收入汇总',
                        key: '/admin/bbzx/qspsrhz',
                    }
                ]
            },
            {
                title: '渠道收入',
                key: '',
                children: [
                    {
                        title: '单渠道视频内容收入明细',
                        key: '/admin/bbzx/dqdspnrsrmx',
                    },
                    {
                        title: '全渠道收入汇总',
                        key: '/admin/bbzx/qqdsrhz',
                    },
                    {
                        title: '全渠道合作数量汇总',
                        key: '/admin/bbzx/qqdhzslhz',
                    }
                ]
            }
        ]
    },
    {
        title: '结算中心',
        key: '/admin/charts',
        children: [
            
               
                    {
                        title: '结算单-简约版',
                        key: '/admin/jszx/jsd_jyb'
                    },
                    {
                        title: '结算单-详细版',
                        key: '/admin/jszx/jsd_xxb'
                    }
        
            
        ]
    },
];
export default menuList;