<template>
  <el-dialog :title="title" :visible.sync="visible">
  	<el-form :model="postForm" ref="postForm" :rules="rules" label-position="right" label-width="80px">
  		<el-row>
  			<el-col :span="24">
  				<el-form-item label="时间范围" prop="timeArr">
  					<el-date-picker
              v-model="postForm.timeArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['09:00:00','09:00:00']"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              :clearable="false">
  					</el-date-picker>
  				</el-form-item>
  			</el-col>
  		</el-row>
  		<el-row>
  			<el-col :span="24">
  				<el-form-item label="站点选择" prop="selectedShops">
  					<el-select style="width: 100%;" v-model="postForm.selectedShops" multiple clearable filterable placeholder="无选项时默认所有站点全部导入">
  					    <el-option
  					      v-for="item in shopsForOptions"
  					      :key="item.id"
  					      :label="item.name"
  					      :value="item.id">
  					    </el-option>
  					</el-select>
  				</el-form-item>
  			</el-col>
  		</el-row>
  	</el-form>
  	<div slot="footer" class="dialog-footer">
  	    <el-button @click="visible = false">取 消</el-button>
  	    <el-button type="primary" @click="submitForm">执 行</el-button>
  	</div>
  </el-dialog>
</template>

<script>
  import '@/utils/date'

  export default {
    name: 'DateDialog',
    components: {

    },
    props: {
      title: {
        type: String,
        default: '',
        required:true
      },
      visible: {
        type: Boolean,
        default: false,
        required:true
      },
      shopsForOptions:{
        type: Array,
        default: [],
        required:true
      }
    },
    data() {
      return {
        loading: false,
        pickerOptions:{
          disabledDate: (time) => {
          	return time.getTime() > Date.now();
          }
        },
        postForm: {},
        rules: {
          timeArr:{
          	required: true,
          	message: '请选择时间范围',
          	trigger: ['change', 'blur']
          }
        },
      }
    },
    computed:{
    	initTime(){
    		var end = new Date();
    		end.setHours(9);
    		end.setMinutes(0);
    		end.setSeconds(0);

    		var start = new Date(end);
    		start.setDate(end.getDate() - 1);
    		return [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')];
    	},
    },
    created() {
      this.$set(this.postForm,'timeArr',this.initTime)
    },
    methods: {
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            var condition = {
              startTime: this.postForm.timeArr[0],
              endTime: this.postForm.timeArr[1],
              selectedShops: this.postForm.selectedShops
            }

            this.$emit('import-submit',condition)

          } else {
            this.$message.warning('请填写正确的表单内容')
            return false
          }
        })
      },
    },

  }
</script>

<style lang="scss" scoped>

</style>
