<template>
	<el-scrollbar height="673px">
		<el-container style="height: 700px">
			<el-header style="background-color: #2c3e50; color: white">
				<back-nav />
			</el-header>
			<el-container style="height: 100%">
				<el-aside width="200px" style="background-color: #545c64">
					<SideNav />
				</el-aside>
				<el-main>
					<el-row justify="center">
						<el-card class="box-card" style="width: 1200px;">
							<!--所有已上线的酒店列表-->
							<h3><i class="el-icon-notebook-2"></i>已上线酒店列表</h3>
							<!--按酒店名称查询酒店-->
							<el-row justify="center">
								<el-col :span="17">
									<el-row justify="start">
										<el-radio-group v-model="searchMode">
											<el-radio-button label="1" border>按酒店名称查找</el-radio-button>
											<el-radio-button label="2" border>按所在城市查找</el-radio-button>
										</el-radio-group>
									</el-row>
								</el-col>
								<el-col :span="7">
									<el-input v-model="searchInput" placeholder="输入酒店名称进行查询" style="margin-top: 2px;"
										prefix-icon="el-icon-office-building" @change="searchHotel">
										<template #append>
											<el-button icon="el-icon-search" @click="searchHotel"></el-button>
										</template>
									</el-input>
								</el-col>
							</el-row>
							<!--已上线酒店列表-->
							<el-divider v-if="this.tableData.length > 0" content-position="left">
								共有{{ this.tableData.length }}家已上线酒店
							</el-divider>
							<el-divider v-if="this.tableData.length==0" content-position="left">
								<div v-if="loading">酒店信息加载中...</div>
								<div v-else>当前没有待审核的酒店</div>
							</el-divider>
							<el-row justify="center">
								<el-table v-loading='loading' border style="width: 100%;margin-top: 10px" height="400px"
									:data="tableData" :header-cell-style="{background:'#ECF5FF',color:'#545c64'}">
									<el-table-column prop="hotelID" label="酒店ID" width="90" sortable>
									</el-table-column>
									<el-table-column prop="hotelName" label="酒店名" width="200" sortable>
									</el-table-column>
									<el-table-column prop="hotelProvince" label="省份" width="80" sortable>
									</el-table-column>
									<el-table-column prop="hotelCity" label="城市" width="80" sortable>
									</el-table-column>
									<el-table-column prop="hotelRegion" label="区" width="80">
									</el-table-column>
									<el-table-column prop="hotelAddress" label="地址" width="290">
									</el-table-column>
									<!--可筛选配图不全的酒店-->
									<el-table-column fixed="right" prop="hotelHaveImage" label="配图" width="80"
										:filters="[{ text: '齐全', value: '齐全' }, { text: '不全', value: '不全' }]"
										:filter-method="filterTag">
									</el-table-column>
									<el-table-column fixed="right" label="详情" width="150" align="center">
										<template #default="scope">
											<el-button icon="el-icon-info" @click="handleClick(scope.row)" type="text"
												size="small">查看
											</el-button>
											<el-button icon="el-icon-delete" @click="deleteClick(scope.$index)"
												type="text" size="small">删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-row>
							<!--酒店详情对话框-->
							<el-dialog class="hotelDetailsDialog" title="酒店详情" v-model="hotelDetails" width="85%"
								body-style="padding-top: 0px;">
								<el-card style="padding: 0px 20px 0px 20px;">
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
											<el-rate v-model="detailedInfo.starLevel" disabled text-color="#ff9900"
												disabled-void-color="white">
											</el-rate>
										</el-descriptions-item>
										<el-descriptions-item>
											<template #label>
												<i class="el-icon-medal"></i>
												评分
											</template>
											<el-rate v-model="detailedInfo.score" disabled show-score
												text-color="#99A9BF" score-template="{value}"
												:icon-classes="['iconfont icon-chaping', 'iconfont icon-zhongping', 'iconfont icon-haoping']"
												disabled-void-color="white" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
											</el-rate>
										</el-descriptions-item>
									</el-descriptions>
									<el-descriptions class="margin-top" :column="5" :size="size" border>
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
												<i class="el-icon-phone-outline"></i>
												联系电话
											</template>
											{{ detailedInfo.phone }}
										</el-descriptions-item>
									</el-descriptions>
									<el-descriptions class="margin-top" :column="3" :size="size" border>
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
									<el-descriptions class="margin-top" :column="1" :size="size" border>
										<el-descriptions-item>
											<template #label>
												<i class="el-icon-office-building"></i>
												酒店介绍
											</template>
											{{ detailedInfo.details }}
										</el-descriptions-item>
									</el-descriptions>
								</el-card>
								<el-card>
									<el-row justify="center">
										<el-col :span="11">
											<!--酒店图片，可上传-->
											<p style="font-size: medium;font-weight: 600;margin-top: 0px;margin-bottom: 20px;"
												align="left">
												酒店图片</p>
											<div class="hotelPic">
												<el-card>
													<el-carousel height="300px" :autoplay="false">
														<el-carousel-item v-for="item in hotelImageUrl" :key="item">
															<el-row justify="center">
																<el-image style="width: 600px;height: 300px;"
																	:src="item" :fit="'contain'">
																</el-image>
															</el-row>
														</el-carousel-item>
													</el-carousel>
												</el-card>
											</div>
											<el-button type="primary" plain icon="el-icon-edit"
												style="margin-top: 10px;"
												@click="setImageButton(this.hotelImageUrl,'酒店')">
												配置图片</el-button>
										</el-col>
										<el-col :span="11">
											<el-row>
												<el-col :span="5">
													<!--酒店房型图片，可以通过选择框选择不同房型，并上传图片-->
													<p style="font-size: medium;font-weight: 600;margin-top: 0px;"
														align="left">
														房型图片 </p>
												</el-col>
												<el-col :span="12">
													<div style="margin-left: 50px;">
														<el-select v-model="roomTypeSelect" placeholder="请选择房型"
															@change="selectRoom">
															<el-option v-for="item in roomTypeOptions" :key="item.value"
																:label="item.label" :value="item.value">
															</el-option>
														</el-select>
													</div>
												</el-col>
											</el-row>
											<div class="roomPic">
												<el-card>
													<el-carousel height="300px" :autoplay="false">
														<el-carousel-item v-for="item in roomImageUrl" :key="item">
															<el-row justify="center">
																<el-image style="width: 600px;height: 300px;"
																	:src="item" :fit="'contain'">
																</el-image>
															</el-row>
														</el-carousel-item>
													</el-carousel>
												</el-card>
											</div>
											<el-button type="primary" plain icon="el-icon-edit"
												style="margin-top: 10px;"
												@click="setImageButton(this.roomImageUrl,'房型')">
												配置图片</el-button>
										</el-col>
									</el-row>
								</el-card>
								<template #footer>
									<span class="dialog-footer">
										<el-button type="primary" @click="backClick" size="medium">返回</el-button>
									</span>
								</template>
								<el-dialog class="setImageDialog" :title="titleType+'-'+titleTypeName+'-图片配置'"
									v-model="setImage" width="40%" body-style="padding-top: 0px;">
									<el-form :model="imageForm" :rules="rules" status-icon ref="imageForm"
										label-width="100px" class="imageFormC">
										<el-form-item label="图片1" prop="image1">
											<el-input v-model="imageForm.image1" style="display: flex;width: 90%;">
											</el-input>
										</el-form-item>
										<el-form-item label="图片2" prop="image2">
											<el-input v-model="imageForm.image2" style="display: flex;width: 90%;">
											</el-input>
										</el-form-item>
										<el-form-item label="图片3" prop="image3">
											<el-input v-model="imageForm.image3" style="display: flex;width: 90%;">
											</el-input>
										</el-form-item>
										<el-button type="primary" @click="submitForm('imageForm')">提交</el-button>
									</el-form>
								</el-dialog>
							</el-dialog>
						</el-card>
					</el-row>
				</el-main>
			</el-container>
		</el-container>
	</el-scrollbar>
</template>

<script>
	import SideNav from "../../components/SideNav"
	import BackNav from "../../components/BackNav"
  import BaseUrl from "../../config"
	//用于备份列表上的全部数据
	let hotelTableData = []

	let imageSetGroup = [] // eslint-disable-line no-unused-vars

	export default {
		components: {
			SideNav,
			BackNav,
		},
		created() {
			hotelTableData = [];
			this.initData();
		},
		data() {
			return {
				size: "",
				detailedInfo: [],
				tableData: [],
				hotelDetails: false,
				setImage: false,
				titleType: '',
				titleTypeName: '',
				imageForm: {
					image1: '',
					image2: '',
					image3: '',
				},
				rules: {
					image1: [{
						required: true,
						message: '请输入图片1的URL',
						trigger: 'blur'
					}],
					image2: [{
						required: true,
						message: '请输入图片2的URL',
						trigger: 'blur'
					}],
					image3: [{
						required: true,
						message: '请输入图片3的URL',
						trigger: 'blur'
					}],
				},
				hotelImageUrl: '',
				roomImageUrl: '',
				roomTypeOptions: [],
				roomTypeSelect: '',
				screeningSwitch: false,
				searchInput: '',
				searchMode: '1',
				tempData: '',
				loading: true,
			}
		},
		methods: {
			//初始化数据
			initData() {
				//调用接口 传入null，获取所有已上线酒店的所有信息并存于hotelData
				this.axios.get(BaseUrl.ZHUNAR + '/api/hotel/passed')
					.then((Response) => {
						//console.log(Response.data)
						for (let hotel of Response.data) {
							let roomD = [];
							for (let room of hotel.roomList) {
								let parameterList = {
									"hotel_id": hotel.hotel_id,
									"picture_type": room.room_type,
									"url": null,
									"sequence": -1
								}
								this.axios.post(BaseUrl.ZHUNAR + '/api/hotelpicture/picture', parameterList)
									.then((Response) => {
										if (Response.data.length === 0) {
											roomD.push({
												roomType: room.room_type,
												roomImage: []
											})
										} else {
											roomD.push({
												roomType: room.room_type,
												roomImage: Response.data
											})
										}
									})
									.catch(() => {
										roomD.push({
											roomType: room.room_type,
											roomImage: []
										})
									})
							}
							//console.log('roomD:', roomD)
							this.axios.get(BaseUrl.ZHUNAR + '/api/hotelpicture/gethotelpicture/' + hotel.hotel_id)
								.then((Response) => {
									let havePic = '齐全'
									let pic = (Response.data.length < 3);
									for (let room of roomD) {
										pic = (pic || (room.roomImage.length < 3));
									}
									if (pic)
										havePic = '不全'; //如果酒店的图片或房型图片不全，则会在列表上显示

									this.tableData.push({
										hotelID: hotel.hotel_id,
										hotelName: hotel.myname,
										hotelProvince: hotel.province,
										hotelCity: hotel.city,
										hotelRegion: hotel.region,
										hotelAddress: hotel.location,
										starLevel: hotel.star_level,
										score: hotel.score,
										details: hotel.details,
										phone: hotel.phone,
										hotelImage: Response.data,
										roomDetails: roomD,
										hotelHaveImage: havePic,
										healthLicense: hotel.sanitation_card,
										fireInspectionCertificate: hotel.fire_card,
										cateringServiceLicense: hotel.catering_card,
									});
									if (this.loading)
										this.loading = false;
								})
						}
					})
					.catch((error) => {
						console.log(error)
					})
				hotelTableData = this.tableData;
			},

			//筛选配图是否齐全
			filterTag(value, row) {
				return row.hotelHaveImage === value;
			},

			//按下搜索按钮，在列表中按名称搜索酒店
			searchHotel() {
				let searchedData = []; //检索到的数据
				let searchedNum = 0; //检索到的数据条数

				if (this.searchMode === '1') {
					for (let hotel of hotelTableData) {
						if (hotel.hotelName.search(this.searchInput) != -1) { // 找到检索目标
							searchedData.push(hotel);
						}
					}
				} else {
					for (let hotel of hotelTableData) {
						if (hotel.hotelCity.search(this.searchInput) != -1) { // 找到检索目标
							searchedData.push(hotel);
						}
					}
				}
				searchedNum = searchedData.length; //记录检索到的数据条数
				this.tableData = searchedData; //在表格上显示检索结果
				console.log(searchedData);

				if (searchedNum == 0) { // 检索结果为0条，即没有搜索结果，弹出提示框	
					if (this.searchMode === '1') {
						this.$alert('搜索不到名为 ' + this.searchInput + ' 的酒店', '查询失败', {
							confirmButtonText: '确定',
						});
					} else {
						this.$alert('搜索不到所在城市为 ' + this.searchInput + ' 的酒店', '查询失败', {
							confirmButtonText: '确定',
						});
					}
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
				//this.hotelScore = this.detailedInfo.score;

				console.log('选择了', this.detailedInfo);

				this.hotelImageUrl = this.detailedInfo.hotelImage; //置入酒店图片

				this.roomTypeOptions = []; //选择框置空
				for (let room of this.detailedInfo.roomDetails) { //载入该酒店房型类型信息
					this.roomTypeOptions.push({
						value: room.roomType,
						label: room.roomType
					});
					console.log(room.roomType);
				}
				this.roomTypeSelect = this.detailedInfo.roomDetails[0].roomType;
				this.roomImageUrl = this.detailedInfo.roomDetails[0].roomImage; //初始化选中第一条房型信息

				this.hotelDetails = true;
			},

			//点击删除按钮
			deleteClick(index) {
				this.$confirm('此操作将永久删除该酒店的所有信息, 是否继续?', '警告', { //确认删除
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({ //反馈结果
						type: 'success',
						message: '删除成功!'
					});

					//调用接口 删除酒店ID为row.hotelID的酒店);
					console.log('删除酒店:', this.tableData[index].hotelID);
					this.axios.delete(BaseUrl.ZHUNAR + '/api/hotel/delete/' + this.tableData[index].hotelID)
						.finally(() => {
							console.log('删除酒店成功:', this.tableData[index].hotelID);
							this.tableData.splice(index, 1);
						});
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
					if (room.roomType == roomT) {
						this.roomImageUrl = room.roomImage;
						console.log(this.roomImageUrl);
					}
				}
				this.roomTypeSelect = roomT;
				console.log(this.roomTypeSelect);
			},

			//配置酒店的图片
			setImageButton(imageGroup, type) {
				this.titleType = type;
				if (type == '酒店')
					this.titleTypeName = this.detailedInfo.hotelName;
				else
					this.titleTypeName = this.roomTypeSelect;
				this.imageForm.image1 = imageGroup[0];
				this.imageForm.image2 = imageGroup[1];
				this.imageForm.image3 = imageGroup[2];
				this.imageSetGroup = imageGroup;
				this.setImage = true;
			},
			
			//检查是否更改了原有的图片信息
			checkChange(imageGroup) {
				if ((imageGroup.length < 1 || this.imageForm.image1 == imageGroup[0]) && (imageGroup.length < 2 || this
						.imageForm.image2 == imageGroup[1]) && (imageGroup.length < 3 || this.imageForm
						.image3 == imageGroup[2])) {
					this.setImageUrl();
					console.log('未修改已有信息');
					this.setImage = false;
				} else {
					if (imageGroup)
						this.$confirm('检测到修改了已有的图片信息, 是否确认修改?', '警告', { //确认删除
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.setImageUrl();
							console.log('重新配置图片信息');
							this.setImage = false;
						})
						.catch(() => {
							this.$message({ //反馈结果
								type: 'info',
								message: '已取消修改'
							});
							console.log('取消修改');
						})
				}
			},
			
			//调用接口 配置酒店或房型的图片列表
			setImageUrl() {
				let type = '酒店'
				if (this.titleType != '酒店')
					type = this.titleTypeName
				let parameterList = {
					"hotel_id": parseInt(this.detailedInfo.hotelID),
					"picture_type": type,
					"url1": this.imageForm.image1,
					"url2": this.imageForm.image2,
					"url3": this.imageForm.image3
				}
				console.log('添加信息', parameterList);
				this.axios.post(BaseUrl.ZHUNAR + '/api/hotelpicture/update', parameterList)
					.then(() => {
						console.log('添加成功', parameterList);
						this.$message({ //反馈结果
							type: 'success',
							message: '配置图片成功!'
						});
						this.updateView([this.imageForm.image1, this.imageForm.image2, this.imageForm.image3])
					})
			},

			//更新页面上的图片信息
			updateView(imageG) {
				if (this.titleType === '酒店') {
					this.detailedInfo.hotelImage = imageG;
					this.hotelImageUrl = imageG;
					this.hotelDetails.find((item) => {
						return item.hotelID === this.detailedInfo.hotelID
					}).hotelImage = imageG;
				} else {
					this.detailedInfo.roomDetails.find((item) => {
						return item.roomType === this.titleTypeName
					}).roomImage = imageG;
					this.selectRoom(this.titleTypeName);
					this.hotelDetails.find((item) => {
						return item.hotelID === this.detailedInfo.hotelID
					}).roomImage = imageG;
				}
			},

			//提交表单
			submitForm(formName) {
				console.log(this.imageSetGroup)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.checkChange(this.imageSetGroup)
					} else {
						this.$message.error('请完成URL填写！');
						return false;
					}
				});
			},

			//点击返回，关闭对话框
			backClick() {
				this.hotelDetails = false;
			},
		},
	}
</script>

<style>
	.hotelDetailsDialog {
		padding: 0px 20px;
	}

	::-webkit-scrollbar {
		width: 0 !important;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}
</style>
