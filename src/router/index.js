import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home'
import Result from '../views/Result'
import Login from '../views/Login'
import Details from '../views/Details'

import Information from "../views/Customer/Info"
import History from "../views/Customer/History"
import Favorite from "../views/Customer/Favorite"
import Order from "../views/Customer/Order"

import HotelHome from "../views/Hotel/Home"
import HotelWait from "../views/Hotel/Wait"
import HotelInformation from "../views/Hotel/Info"
import HotelRoom from "../views/Hotel/Room"
import HotelOrder from "../views/Hotel/Order"
import HotelReport from "../views/Hotel/Report"

import AdminEvaluate from "../views/Administrator/Evaluate"
import AdminManage from "../views/Administrator/Manage"
import AdminReply from "../views/Administrator/Reply"

const routes = [
	//侧导航栏和顶部导航栏
	{ path: '/', 			redirect: '/home' }, // 重定向到首页
	{ path: '/home', 		component: Home },
	{ path: '/result',		component: Result},
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
	{ path: '/hotel/room', 		component: HotelRoom },
	{ path: '/hotel/order', 	component: HotelOrder },
	{ path: '/hotel/report', 	component: HotelReport },

	{ path: '/admin/evaluate', 		component: AdminEvaluate },
	{ path: '/admin/manage', 		component: AdminManage },
	{ path: '/admin/reply', 		component: AdminReply },

]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
