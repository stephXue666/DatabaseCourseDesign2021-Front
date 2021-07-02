import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home'
import Login from '../views/Login'
import Details from '../views/Details'

import Information from "../views/Customer/Info"
import History from "../views/Customer/History";
import Favorite from "../views/Customer/Favorite";
import Order from "../views/Customer/Order";

import HotelHome from "../views/Hotel/Home"
import HotelWait from "../views/Hotel/Wait"
import HotelInformation from "../views/Hotel/Info"
import HotelOrder from "../views/Hotel/Order"
import HotelReport from "../views/Hotel/Report"

import AdminHome from "../views/Administrator/Home"
import AdminEvaluate from "../views/Administrator/Evaluate"
import AdminManage from "../views/Administrator/Manage"
import AdminReply from "../views/Administrator/Reply"

const routes = [
	//侧导航栏和顶部导航栏
	{ path: '/', 			redirect: '/home' }, // 重定向到首页
	{ path: '/home', 		component: Home },
	{ path: '/login', 		component: Login },
	{ path: '/logout', 		redirect: '/home' },
	{ path: '/details',		component: Details},

	{ path: '/info', 		component: Information },
	{ path: '/history', 	component: History },
	{ path: '/favorite', 	component: Favorite },
	{ path: '/order', 		component: Order },

	{ path: '/hotel/home', 		component: HotelHome },
	{ path: '/hotel/wait', 		component: HotelWait },
	{ path: '/hotel/info', 		component: HotelInformation },
	{ path: '/hotel/order', 	component: HotelOrder },
	{ path: '/hotel/report', 	component: HotelReport },

	{ path: '/admin/home', 		component: AdminHome },
	{ path: '/admin/evaluate', 		component: AdminEvaluate },
	{ path: '/admin/manage', 		component: AdminManage },
	{ path: '/admin/reply', 		component: AdminReply },
	/*{ 子路由，暂时没想好有没有用的必要
		path: '/top',
		component: TopNav,
		redirect: '/home',
		children: [
			{ path: '/home', 	component: Home },
			{ path: '/login', 	component: Login },
		]
	},*/
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
