<template>
	<el-scrollbar height="673px">
		<el-container style="height: 700px">
			<el-header style="background-color: #2c3e50; color: white">
				<back-nav />
			</el-header>
			<el-container style="height: 100%">
				<el-aside width="200px" style="background-color: #545c64;height: 100%;">
					<SideNav />
				</el-aside>
				<el-main>
					<el-row justify="center">
						<el-card class="box-card" style="width: 950px;">
							<!--待审核酒店列表-->
							<h3><i class="el-icon-notebook-2"></i>待审核酒店列表</h3>
							<el-divider v-if="this.tableData.length>0" content-position="left">
								有{{ this.tableData.length }}条酒店信息待审核
							</el-divider>
							<el-divider v-if="this.tableData.length==0" content-position="left">
								<div v-if="loading">酒店信息加载中...</div>
								<div v-else>当前没有待审核的酒店</div>
							</el-divider>
							<el-row justify="center">
								<el-table v-loading="loading" border style="width: 100%" height="450px"
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
									<el-table-column fixed="right" label="详情" width="80" align="center">
										<template #default="scope">
											<el-button icon="el-icon-info" @click="handleClick(scope.row)" type="text"
												size="small">查看
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-row>
							<!--点击"查看"按钮，打开酒店详情页面-->
							<el-dialog title="酒店详情" v-model="dialogAudit" width="30%">
								<el-descriptions title="基本信息" class="margin-top" :column="2" :size="size" border>
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
										{{ detailedInfo.hotelName }}
									</el-descriptions-item>
								</el-descriptions>
								<el-descriptions class="margin-top" :column="3" :size="size" border>
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
								</el-descriptions>
								<el-descriptions class="margin-top" :column="1" :size="size" border>
									<el-descriptions-item>
										<template #label>
											<i class="el-icon-place"></i>
											详细地址
										</template>
										{{ detailedInfo.hotelAddress }}
									</el-descriptions-item>
								</el-descriptions>
								<el-descriptions title="审核信息" class="margin-top" :column="1" :size="size" border>
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
								<el-form label-position="formLabelPosition" :model="form">
									<el-row class="autocomplete">
										<el-col :span="24">
											<div class="sub-title">审核说明</div>
											<el-autocomplete class="inline-input" v-model="dataDescrip"
												v-bind:disabled="disabledDescrip" :fetch-suggestions="querySearch"
												placeholder="请输入内容" @select="handleSelect">
											</el-autocomplete>
										</el-col>
									</el-row>
									<p></p>
									<div class="sub-title">审核结果</div>
									<el-select v-model="form.choice" placeholder="请选择审核结果" @change="auditSelect">
										<el-option label="审核驳回" value=false></el-option>
										<el-option label="审核通过" value=true></el-option>
									</el-select>
								</el-form>
								<template #footer>
									<span class="dialog-footer">
										<el-button type="primary" @click="submitClick" size="small">提交</el-button>
									</span>
								</template>
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
	import {
		//define Component,
		ref,
		onMounted
	} from 'vue'

	export default {
		components: {
			SideNav,
			BackNav,
		},
		created() {
			this.initData()
		},
		data() {
			return {
				allHotelsNum: 0,
				tableData: [],
				detailedInfo: {},
				dialogAudit: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				formLabelWidth: '100px',
				formLabelPosition: 'middle',
				size: "",
				loading: true,
			}
		},
		setup() {
			const restaurants = ref([]);
			const querySearch = (queryString, cb) => {
				var results = queryString ?
					restaurants.value.filter(createFilter(queryString)) :
					restaurants.value;
				// 调用 callback 返回建议列表的数据
				cb(results);
			};
			const createFilter = (queryString) => {
				return (restaurant) => {
					return (
						restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
						0
					);
				};
			};
			//"审核说明"输入框的建议列表数据
			const loadAll = () => {
				return [{
						value: "卫生许可证无效"
					},
					{
						value: "卫生许可证过期"
					},
					{
						value: "消防检查合格证无效"
					},
					{
						value: "消防检查合格证过期"
					},
					{
						value: "餐饮服务经营许可证无效"
					},
					{
						value: "餐饮服务经营许可证过期"
					}
				]
			};
			const handleSelect = (item) => {
				console.log(item);
			};
			onMounted(() => {
				restaurants.value = loadAll();
			});
			return {
				restaurants,
				dataDescrip: ref(''),
				disabledDescrip: false,
				querySearch,
				createFilter,
				loadAll,
				handleSelect,
			};
		},
		methods: {
			//初始化列表数据
			initData() {
				//调用接口 传入null，获取所有未审核酒店的基本信息并存于hotelData
				this.tableData=[];
				this.axios.get(BaseUrl.ZHUNAR + "/api/hotel/unpassed")
					.then((Response) => {
						console.log(Response.data)
						for (let hotel of Response.data) {
							this.tableData.push({
								hotelID: hotel.hotel_id,
								hotelName: hotel.myname,
								hotelProvince: hotel.province,
								hotelCity: hotel.city,
								hotelRegion: hotel.region,
								hotelAddress: hotel.location,
								healthLicense: hotel.sanitation_card,
								fireInspectionCertificate: hotel.fire_card,
								cateringServiceLicense: hotel.catering_card,
							});
						}
						if (this.loading)
							this.loading = false;
						this.form.choice = '';
					})
					.catch((error) => {
						console.log(error)
					})
			},

			//当点击"查看"按钮时，打开酒店详情弹框
			handleClick(row) {
				console.log('选择酒店', row);
				this.detailedInfo = row;
				this.dialogAudit = true;
			},
			
			//当选择了"审核结果"的某个选项时，调用此函数
			auditSelect() {
				console.log('审核结果', this.form.choice);
				if (this.form.choice == 'true') { //如果选择了"审核通过"，则屏蔽"审核说明"输入框
					this.disabledDescrip = true;
					this.dataDescrip = 'success';
				} else if (this.dataDescrip == 'success') { //如果选择了"审核驳回"且输入框内容是"通过无需说明"，则解除屏蔽"审核说明"输入框，并清空
					this.disabledDescrip = false
					this.dataDescrip = '';
				}
			},
			
			//点击提交审核
			submitClick() {
				console.log('审核结果', this.form.choice, '描述：', this.dataDescrip);
				console.log('酒店ID:', this.detailedInfo.hotelID);
				if (this.form.choice == '' || (this.form.choice == 'false' && this.dataDescrip == ''))
					this.$message.error('未完成酒店审核填写，提交失败!');
				else {
					this.$message({ //检索到结果，反馈成功消息提示
						message: '审核提交成功!',
						type: 'success'
					});

					//调用接口，传入酒店ID detailedInfo.hotelID,审核结果 form.choice及说明 dataDescrip，返回null					
					this.axios.put(BaseUrl.ZHUNAR + "/api/registration/audit?id=" + this.detailedInfo.hotelID +
							"&reason=" + this.dataDescrip)
						.then(() => {
							this.dataDescrip = '';
							this.form.choice = ''; //清空"审核说明"输入框与"审核结果"选择框
							this.disabledDescrip = false; //解除屏蔽"审核说明"输入框
							this.dialogAudit = false;
							this.initData();
						})
				}
			},
		},
	}
</script>

<style>
	::-webkit-scrollbar {
		width: 0 !important;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}
</style>
