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
					<!--待审核酒店列表-->
					<h3>待审核酒店列表</h3>
					<el-table :data="tableData" border style="width: 100%">
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
						<el-table-column prop="hotelAddress" label="地址" width="600">
						</el-table-column>
						<el-table-column fixed="right" label="详情" width="100">
							<template #default="scope">
								<el-button @click="handleClick(scope.row)" type="text" size="small">查看
								</el-button>
							</template>
						</el-table-column>
					</el-table>
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
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import SideNav from "../../components/SideNav"
	import BackNav from "../../components/BackNav"
	import {
		ElMessage
	} from 'element-plus'
	import {
		//define Component,
		ref,
		onMounted
	} from 'vue'

	//未审核酒店的基本信息
	let hotelData = [{
		hotelID: 1123456789,
		hotelName: '7天优品',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路576号',
		healthLicense: '0100S00500',
		fireInspectionCertificate: '0100S00501',
		cateringServiceLicense: '0100S00502',
	}, {
		hotelID: 1123456788,
		hotelName: '城市便捷',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路526号',
		healthLicense: '0100S00400',
		fireInspectionCertificate: '0100S00401',
		cateringServiceLicense: '0100S00402',
	}, {
		hotelID: 1123456787,
		hotelName: '如家',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路516号',
		healthLicense: '0100S00300',
		fireInspectionCertificate: '0100S00301',
		cateringServiceLicense: '0100S00302',
	}, {
		hotelID: 1123456786,
		hotelName: '布丁酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路596号',
		healthLicense: '0100S00200',
		fireInspectionCertificate: '0100S00201',
		cateringServiceLicense: '0100S00202',
	}, {
		hotelID: 1123456785,
		hotelName: '格林森豪',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路456号',
		healthLicense: '0100S00100',
		fireInspectionCertificate: '0100S00101',
		cateringServiceLicense: '0100S00102',
	}, {
		hotelID: 1123456784,
		hotelName: '艾怡商务酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路126号',
		healthLicense: '0100S00900',
		fireInspectionCertificate: '0100S00901',
		cateringServiceLicense: '0100S00902',
	}, {
		hotelID: 1123456783,
		hotelName: '贝壳酒店',
		hotelProvince: '上海',
		hotelCity: '上海市',
		hotelRegion: '嘉定区',
		hotelAddress: '曹安公路绿苑路235号',
		healthLicense: '0100S00800',
		fireInspectionCertificate: '0100S00801',
		cateringServiceLicense: '0100S00802',
	}]
	export default {
		components: {
			SideNav,
			BackNav,
		},
		created() {
			//调用接口- 传入null，获取所有未审核酒店的基本信息并存于hotelData
			for (let hotel of hotelData) {
				this.tableData.push(hotel);
			}
			this.form.choice = '';
		},
		data() {
			return {
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
			//当点击"查看"按钮时，打开酒店详情弹框
			handleClick(row) {
				console.log('选择了', row);
				this.detailedInfo = row;
				this.dialogAudit = true;
			},
			//当选择了"审核结果"的某个选项时，调用此函数
			auditSelect() {
				console.log('选择了', this.form.choice);
				if (this.form.choice == 'true') { //如果选择了"审核通过"，则屏蔽"审核说明"输入框
					console.log('选择', this.form.choice);
					this.disabledDescrip = true;
					this.dataDescrip = '通过无需说明';
				} else if (this.dataDescrip == '通过无需说明') { //如果选择了"审核驳回"且输入框内容是"通过无需说明"，则解除屏蔽"审核说明"输入框，并清空
					console.log('选择', this.form.choice);
					this.disabledDescrip = false
					this.dataDescrip = '';
				}
			},
			submitClick() {
				console.log(this.dataDescrip, this.form.choice);
				console.log(this.detailedInfo.hotelID);
				//调用接口-，传入酒店ID detailedInfo.hotelID,审核结果 form.choice及说明 dataDescrip，返回null
				if (this.form.choice == '' || (this.form.choice == 'false' && this.dataDescrip == ''))
					this.$message.error('未完成酒店审核填写，提交失败');
				else {
					ElMessage('审核提交成功');
					this.dataDescrip = '';
					this.form.choice = ''; //清空"审核说明"输入框与"审核结果"选择框
					this.disabledDescrip = false; //解除屏蔽"审核说明"输入框
					this.dialogAudit = false;
				}
			},
		},
	}
</script>
