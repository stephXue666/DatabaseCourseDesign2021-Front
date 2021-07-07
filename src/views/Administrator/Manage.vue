<template>
	<el-container style="height: 700px">
		<el-header style="background-color: #2c3e50; color: white">
			<back-nav />
		</el-header>
		<el-container style="height: 100%">
			<el-aside width="200px" style="background-color: #545c64">
				<SideNav />
			</el-aside>
			<el-main>
				<el-card class="box-card">
					<!--所有已上线的酒店列表-->
					<h3>已上线酒店列表</h3>
					<!--按酒店名称查询酒店-->
					<el-row>
						<el-col :span="8">
							<div style="margin-top: 10px">
								<p style="font-size: small;font-weight: 400;margin-right: 10px;">
									<i class="el-icon-office-building"></i>
									查询酒店名称:
								</p>
							</div>
						</el-col>
						<el-col :span="8">
							<el-input v-model="searchInput" placeholder="请输入酒店名称" style="margin-top: 2px;"
								suffix-icon="el-icon-search"></el-input>
						</el-col>
						<el-col :span="3"></el-col>
						<el-button icon="el-icon-search" size="small" type="primary" plain @click="searchHotelName">搜索
						</el-button>
					</el-row>
					<!--已上线酒店列表-->
					<el-table :data="tableData" border style="width: 100%;margin-top: 10px">
						<el-table-column prop="hotelID" label="酒店ID" width="120">
						</el-table-column>
						<el-table-column prop="hotelName" label="酒店名" width="120">
						</el-table-column>
						<el-table-column prop="hotelProvince" label="省份" width="120">
						</el-table-column>
						<el-table-column prop="hotelCity" label="城市" width="120">
						</el-table-column>
						<el-table-column prop="hotelRegion" label="区" width="120">
						</el-table-column>
						<el-table-column prop="hotelAddress" label="地址" width="200">
						</el-table-column>
						<!--可筛选配图不全的酒店-->
						<el-table-column prop="hotelHavePicture" label="配图" width="120"
							:filters="[{ text: '齐全', value: '齐全' }, { text: '不全', value: '不全' }]"
							:filter-method="filterTag">
						</el-table-column>
						<el-table-column fixed="right" label="详情" width="100">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">查看
								</el-button>
								<el-button @click="deleteClick(scope.row)" type="text" size="small">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--酒店详情对话框-->
					<el-dialog title="酒店详情" v-model="dialogDetails" width="80%">
						<!--酒店信息描述列表-->
						<p style="font-size: medium;font-weight: 600;" align="left">酒店信息</p>
						<el-descriptions class="margin-top" :column="4" :size="size" border>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-user-solid"></i>
									酒店ID
								</template>
								{{detailedInfo.hotelID}}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-user"></i>
									酒店名
								</template>
								{{detailedInfo.hotelName}}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-star-off"></i>
									星级
								</template>
								{{detailedInfo.starLevel}}
								<i class="el-icon-star-on" style="color:#191a1d;font-size: large;"></i>
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-medal"></i>
									评分
								</template>
								<el-rate v-model="hotelScore" disabled show-score text-color="#ff9900"
									score-template="{value}">
								</el-rate>
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-map-location"></i>
									省
								</template>
								{{detailedInfo.hotelProvince}}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-location-information"></i>
									市
								</template>
								{{ detailedInfo.hotelCity }}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-location-outline"></i>
									区
								</template>
								{{ detailedInfo.hotelRegion }}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-place"></i>
									详细地址
								</template>
								{{ detailedInfo.hotelAddress }}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-postcard"></i>
									卫生许可证
								</template>
								{{ detailedInfo.healthLicense }}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-postcard"></i>
									消防检查合格证
								</template>
								{{ detailedInfo.fireInspectionCertificate }}
							</el-descriptions-item>
							<el-descriptions-item>
								<template #label>
									<i class="el-icon-postcard"></i>
									餐饮服务经营许可证
								</template>
								{{ detailedInfo.cateringServiceLicense }}
							</el-descriptions-item>
						</el-descriptions>
						<!--酒店图片，可上传-->
						<p style="font-size: medium;font-weight: 600;" align="left">
							酒店图片</p>
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
							align="left" :show-file-list="false" :on-success="hotelHandleAvatarSuccess"
							:before-upload="beforeHotelAvatarUpload">
							<img v-if="hotelImageUrl" :src="hotelImageUrl" class="avatar">
							<i v-else class="el-icon-picture-outline" style="font-size: 600%;"></i>
						</el-upload>
						<p align="left">(点击上方上传图片，支持的图片格式为jpg、jpeg、png) </p>
						<!--酒店房型图片，可以通过选择框选择不同房型，并上传图片-->
						<p style="font-size: medium;font-weight: 600;" align="left">
							房型图片 </p>
						<p align="left">
							<el-select v-model="roomTypeSelect" placeholder="请选择房型" @change="selectRoom">
								<el-option v-for="item in roomTypeOptions" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</p>
						<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
							align="left" :show-file-list="false" :on-success="roomHandleAvatarSuccess"
							:before-upload="beforeRoomAvatarUpload">
							<img v-if="roomImageUrl" :src="roomImageUrl" class="avatar">
							<i v-else class="el-icon-picture-outline" style="font-size: 600%;"></i>
						</el-upload>
						<p align="left">(点击上方上传图片，支持的图片格式为jpg、jpeg、png)</p>
						<template #footer>
							<span class="dialog-footer">
								<el-button type="primary" @click="backClick" size="medium">返回</el-button>
							</span>
						</template>
					</el-dialog>
				</el-card>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import SideNav from "../../components/SideNav"
	import BackNav from "../../components/BackNav"

	//所有已上线酒店的全部信息
	let hotelData = [{
		hotelID: 2123456789,
		hotelName: '皇冠假日酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '博园路6775号',
		starLevel: 3,
		score: 4.5,
		details: '优质服务酒店，临近上海赛车场，距离最近地铁站1.7km',
		phone: '021-60568888',
		roomDetails: [{
			roomType: '单人房',
			roomPicture: 'https://img2.baidu.com/it/u=234528507,754503968&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '双人房',
			roomPicture: 'https://img2.baidu.com/it/u=53369519,2141829675&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '套房',
			roomPicture: 'https://img0.baidu.com/it/u=1915008493,2234840924&fm=26&fmt=auto&gp=0.jpg'
		}],
		hotelPicture: 'https://img2.baidu.com/it/u=1534297750,765637591&fm=26&fmt=auto&gp=0.jpg',
		hotelHavePicture: '齐全',
		healthLicense: '0200S00500',
		fireInspectionCertificate: '0200S00501',
		cateringServiceLicense: '0200S00502',
	}, {
		hotelID: 2123456788,
		hotelName: '全季酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '博园路6774号',
		starLevel: 2,
		score: 4.5,
		details: '优质服务酒店，临近上海赛车场，距离最近地铁站1.7km',
		phone: '021-60568888',
		roomDetails: [{
			roomType: '单人房',
			roomPicture: 'https://img2.baidu.com/it/u=234528507,754503968&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '双人房',
			roomPicture: 'https://img2.baidu.com/it/u=53369519,2141829675&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '套房',
			roomPicture: 'https://img0.baidu.com/it/u=1915008493,2234840924&fm=26&fmt=auto&gp=0.jpg'
		}],
		hotelPicture: 'https://img1.baidu.com/it/u=1844891672,3716860995&fm=26&fmt=auto&gp=0.jpg',
		hotelHavePicture: '齐全',
		healthLicense: '0200S00400',
		fireInspectionCertificate: '0200S00401',
		cateringServiceLicense: '0200S00402',
	}, {
		hotelID: 2123456787,
		hotelName: '美丽豪酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '博园路6773号',
		starLevel: 2,
		score: 4.5,
		details: '优质服务酒店，临近上海赛车场，距离最近地铁站1.7km',
		phone: '021-60568888',
		roomDetails: [{
			roomType: '单人房',
			roomPicture: 'https://img2.baidu.com/it/u=234528507,754503968&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '双人房',
			roomPicture: 'https://img2.baidu.com/it/u=53369519,2141829675&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '套房',
			roomPicture: 'https://img0.baidu.com/it/u=1915008493,2234840924&fm=26&fmt=auto&gp=0.jpg'
		}],
		hotelPicture: 'https://img2.baidu.com/it/u=2039534303,986455833&fm=26&fmt=auto&gp=0.jpg',
		hotelHavePicture: '齐全',
		healthLicense: '0200S00300',
		fireInspectionCertificate: '0200S00301',
		cateringServiceLicense: '0200S00302',
	}, {
		hotelID: 2123456786,
		hotelName: '榴莲小星酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '博园路6772号',
		starLevel: 1,
		score: 4.5,
		details: '优质服务酒店，临近上海赛车场，距离最近地铁站1.7km',
		phone: '021-60568888',
		roomDetails: [{
			roomType: '单人房',
			roomPicture: 'https://img2.baidu.com/it/u=234528507,754503968&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '双人房',
			roomPicture: 'https://img2.baidu.com/it/u=53369519,2141829675&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '套房',
			roomPicture: 'https://img0.baidu.com/it/u=1915008493,2234840924&fm=26&fmt=auto&gp=0.jpg'
		}],
		hotelPicture: '',
		hotelHavePicture: '齐全',
		healthLicense: '0200S00200',
		fireInspectionCertificate: '0200S00201',
		cateringServiceLicense: '0200S00202',
	}, {
		hotelID: 2123456785,
		hotelName: '海友酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '博园路6771号',
		starLevel: 1,
		score: 4.5,
		details: '优质服务酒店，临近上海赛车场，距离最近地铁站1.7km',
		phone: '021-60568888',
		roomDetails: [{
			roomType: '单人房',
			roomPicture: 'https://img2.baidu.com/it/u=234528507,754503968&fm=26&fmt=auto&gp=0.jpg'
		}, {
			roomType: '双人房',
			roomPicture: ''
		}, {
			roomType: '套房',
			roomPicture: 'https://img0.baidu.com/it/u=1915008493,2234840924&fm=26&fmt=auto&gp=0.jpg'
		}],
		hotelPicture: 'https://img1.baidu.com/it/u=1792065286,525492636&fm=26&fmt=auto&gp=0.jpg',
		hotelHavePicture: '齐全',
		healthLicense: '0200S00100',
		fireInspectionCertificate: '0200S00101',
		cateringServiceLicense: '0200S00102',
	}]

	//用于备份列表上的全部数据
	let hotelTableData

	export default {
		components: {
			SideNav,
			BackNav,
		},
		created() {
			this.initData();
		},
		data() {
			return {
				size: "",
				detailedInfo: [],
				tableData: [],
				dialogDetails: false,
				hotelImageUrl: '',
				roomImageUrl: '',
				roomTypeOptions: [],
				roomTypeSelect: '',
				screeningSwitch: false,
				searchInput: '',
			}
		},
		methods: {
			//初始化数据
			initData() {
				//调用接口- 传入null，获取所有已上线酒店的所有信息并存于hotelData

				this.tableData = [];
				for (let hotel of hotelData) {
					let pic = (hotel.hotelPicture == '');
					for (let room of hotel.roomDetails) {
						pic = (pic || (room.roomPicture == ''));
					}
					if (pic)
						hotel.hotelHavePicture = '不全'; //如果酒店的图片或房型图片不全，则会在列表上显示
					this.tableData.push(hotel);
				}
				//用hotelTableData备份列表上的全部数据
				hotelTableData = this.tableData;
			},

			//筛选配图是否齐全
			filterTag(value, row) {
				return row.hotelHavePicture === value;
			},

			//按下搜索按钮，在列表中按名称搜索酒店
			searchHotelName() {
				let searchedData = []; //检索到的数据
				let searchedNum = 0; //检索到的数据条数

				for (let hotel of hotelTableData) {
					if (hotel.hotelName.search(this.searchInput) != -1) { // 找到检索目标
						searchedData.push(hotel);
					}
				}
				searchedNum = searchedData.length; //记录检索到的数据条数
				this.tableData = searchedData; //在表格上显示检索结果
				console.log(searchedData);

				if (searchedNum == 0) { // 检索结果为0条，即没有搜索结果，弹出提示框	
					this.$alert('搜索不到名为 ' + this.searchInput + ' 的酒店', '查询失败', {
						confirmButtonText: '确定',
					});
				} else {
					this.$message({ //检索到结果，反馈成功消息提示
						message: '搜索成功，共有' + searchedNum + '条结果',
						type: 'success'
					});
				}
			},

			//当点击"查看"按钮时，打开酒店详情弹框
			handleClick(row) {
				//给detailedInfo传入该行酒店的详细信息
				this.detailedInfo = row;
				//评分用Rate组件，单独传值
				this.hotelScore = this.detailedInfo.score;

				console.log('选择了', this.detailedInfo);

				this.hotelImageUrl = this.detailedInfo.hotelPicture; //置入酒店图片

				this.roomTypeOptions = []; //选择框置空
				for (let room of this.detailedInfo.roomDetails) { //载入该酒店房型类型信息
					this.roomTypeOptions.push({
						value: room.roomType,
						label: room.roomType
					});
					console.log(room.roomType);
				}
				this.roomTypeSelect = this.detailedInfo.roomDetails[0].roomType;
				this.roomImageUrl = this.detailedInfo.roomDetails[0].roomPicture; //初始化选中第一条房型信息

				this.dialogDetails = true;
			},

			//点击删除按钮
			deleteClick(index, row) {
				this.$confirm('此操作将永久删除该酒店的所有信息, 是否继续?', '警告', { //确认删除
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({ //反馈结果
						type: 'success',
						message: '删除成功!'
					});
					this.tableData.splice(index, 1);
					//调用接口- 删除酒店ID为row.hotelID的酒店);
				}).catch(() => { //反馈结果
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			//房型选择框新选中一个房型时
			selectRoom(roomT) {
				for (let room of this.detailedInfo.roomDetails) { //找到匹配的房型照片填充
					if (room.roomType == roomT)
						this.roomImageUrl = room.roomPicture;
				}
				this.roomTypeSelect = roomT;
				console.log(this.roomTypeSelect);
			},

			//上传酒店图片
			hotelHandleAvatarSuccess(res, file) {
				this.hotelImageUrl = URL.createObjectURL(file.raw);
				console.log(this.hotelImageUrl);
				//调用接口- 将酒店ID和酒店图片的url发送到后台存入数据库
				this.initData(); //更新数据
			},

			//上传房型图片
			roomHandleAvatarSuccess(res, file) {
				this.roomImageUrl = URL.createObjectURL(file.raw);
				console.log(this.roomImageUrl);
				//调用接口- 将酒店ID、房型及房型图片的url发送到后台存入数据库
				this.initData(); //更新数据
			},

			//检查图片格式
			beforeHotelAvatarUpload(file) {
				console.log(file);
				let isPic = false;
				for (let pic of ['image/jpg', 'image/jpeg', 'image/png'])
					isPic = file.type === 'image/jpeg';
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isPic) {
					this.$message.error('上传的图片只能是 JPG/JEPG/PNG 格式!');
				}
				if (!isLt10M) {
					this.$message.error('上传的图片大小不能超过 10MB!');
				}
				if (isPic && isLt10M) {
					this.$message({
						message: '成功上传图片',
						type: 'success'
					});
				}
			},

			//检查图片格式
			beforeRoomAvatarUpload(file) {
				console.log(file);
				let isPic = false;
				for (let pic of ['image/jpg', 'image/jpeg', 'image/png'])
					isPic = file.type === 'image/jpeg';
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isPic) {
					this.$message.error('上传的图片只能是 JPG/JEPG/PNG 格式!');
				}
				if (!isLt10M) {
					this.$message.error('上传的图片大小不能超过 10MB!');
				}
				if (isPic && isLt10M) {
					this.$message({
						message: '成功上传图片',
						type: 'success'
					});
				}
			},
			
			//点击返回，关闭对话框
			backClick() {
				this.dialogDetails = false;
			}
		},
	}
</script>
