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
					<!--这里写代码-->
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
					<el-dialog title="酒店详情" v-model="dialogAudit" width="30%">
						<p align="left">
							酒店ID: {{ detailedInfo.hotelID }} </p>
						<p align="left">
							酒店名: {{ detailedInfo.hotelName }} </p>
						<p align="left">
							所在省份: {{ detailedInfo.hotelProvince }} </p>
						<p align="left">
							所在城市: {{ detailedInfo.hotelCity }} </p>
						<p align="left">
							所在区: {{ detailedInfo.hotelRegion }} </p>
						<p align="left">
							详细地址: {{ detailedInfo.hotelAddress }} </p>
						<p align="left">
							卫生许可证: {{ detailedInfo.healthLicense }} </p>
						<p align="left">
							消防检查合格证: {{ detailedInfo.fireInspectionCertificate }} </p>
						<p align="left">
							餐饮服务经营许可证: {{ detailedInfo.cateringServiceLicense }} </p>
						<el-form label-position="formLabelPosition" :model="form">
							<el-row class="autocompleteDescrip">
								<el-col :span="24">
									<div style="position:relative;" class="sub-title">审核说明</div>
									<el-autocomplete class="inputDescrip" v-model="dataDescrip"
										:fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
									</el-autocomplete>
								</el-col>
							</el-row>
							<p></p>
							<div class="sub-title">审核结果</div>
							<el-select v-model="form.region" placeholder="请选择审核结果">
								<el-option label="审核驳回" value="false"></el-option>
								<el-option label="审核通过" value="true"></el-option>
							</el-select>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button type="primary" @click="submitClick()" size="small">提交</el-button>
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
		defineComponent,
		ref,
		onMounted
	} from 'vue'

	export default {
		components: {
			SideNav,
			BackNav,
		},
		data() {
			return {
				tableData: [{
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
				}, ],
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
				state1: ref(''),
				state2: ref(''),
				querySearch,
				createFilter,
				loadAll,
				handleSelect,
			};
		},
		methods: {
			handleClick(row) {
				console.log(row);
				this.detailedInfo = row;
				this.dialogAudit = true;
			},
			submitClick() {
				this.dialogAudit = false;
			},
		},
	}
</script>
