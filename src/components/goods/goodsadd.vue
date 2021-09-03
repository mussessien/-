<template>
<el-card style="height:100%">
  <my-bread level1="商品管理" level2="商品列表"></my-bread>
  <!-- 添加信息提示框 -->
    <el-alert
    title="请添加商品信息"
    type="info"
    center
    show-icon
    class="alert">
  </el-alert>

  <!-- 步骤条 -->
  <el-steps  :active="active-0" finish-status="success" align-center style="margin-top: 20px; margin-bottom: 20px">
  <el-step title="商品信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
</el-steps>

<!-- 侧边步骤选择 -->
<el-form label-position="top" label-width="80px" :model="formLabelAlign" style="height:450px;overflow:auto;" >
 <el-tabs v-model="active"  @tab-click="Changetabs()" tab-position='left' >
    <el-tab-pane label="商品信息" name="1">
  <el-form-item label="商品名称">
    <el-input v-model="formLabelAlign.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格">
    <el-input v-model="formLabelAlign.goods_price"></el-input>
  </el-form-item>
  <el-form-item label="商品重量">
    <el-input v-model="formLabelAlign.goods_weight"></el-input>
  </el-form-item>
    <el-form-item label="商品数量">
    <el-input v-model="formLabelAlign.goods_number"></el-input>
  </el-form-item>
    <el-form-item label="选择分类">
    <el-cascader :options="options" clearable :props="{ expandTrigger:'hover', label: 'cat_name', value: 'cat_id', children: 'children'}" :show-all-levels="false" props.expandTrigger='hover' v-model="selectOptions"></el-cascader>
  </el-form-item>
    </el-tab-pane>

    <!-- 商品参数复选框 -->
    <el-tab-pane label="商品参数" name="2">
      <template v-if="this.arrDyparams.length===0">
        <h1>该类别商品暂未分配参数</h1>
      </template>
      <template v-else>
          <el-form-item :label="item.attr_name" v-for="(item, index) in arrDyparams" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                 <el-checkbox border :label="item2" v-for="(item2, index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
          </el-form-item>
      </template>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="3">
      <el-form-item :label="item.attr_name" v-for="(item, index) in arrStaparams" :key="index">
      <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="4">
      <el-upload
        class="upload-demo"
        action="http://127.0.0.1:8888/api/private/v1/upload/"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforePicUpload"
        list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="5">
      <el-button type="success" round @click="AddGoods()">添加商品</el-button>
      <quillEditor class="editor" v-model="formLabelAlign.goods_introduce"></quillEditor>
    </el-tab-pane>
  </el-tabs>
  </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    quillEditor
  },
  data () {
    return {
      headers: {
        Authorization: localStorage.getItem('token')
      },
      // 动态参数存放数组
      arrDyparams: [],
      arrStaparams: [],
      active: '1',
      // | goods_name      | 商品名称                                          | 不能为空 |
      // | goods_cat       | 以为','分割的分类列表  需要转换为字符串                             | 不能为空 |
      // | goods_price     | 价格                                              | 不能为空 |
      // | goods_number    | 数量                                              | 不能为空 |
      // | goods_weight    | 重量                                              | 不能为空 |
      // | goods_introduce | 介绍                                              | 可以为空 |
      // | pics            | 上传的图片临时路径（对象）                        | 可以为空 |
      // | attrs           | 商品的参数（数组），包含 `动态参数` 和 `静态属性` | 可以为空 |
      formLabelAlign: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      options: [],
      selectOptions: []
    }
  },
  created () {
    this.getGoodsSort()
  },
  methods: {
    // 添加商品至后台
    async AddGoods () {
      this.formLabelAlign.goods_cat = this.selectOptions.join(',')
      const res = await this.$http.post('goods', this.formLabelAlign)
      console.log(res)
      if (res.data.meta.status !== 201) {
        this.$message.error(res.data.meta.msg)
      } else {
        this.$message.success('添加商品成功')
      }
    },
    // 图片上传功能相关函数
    beforePicUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isJPEG = file.type === 'image/jpg'
      const isPNG = file.type === 'image/png'
      const isLimit5M = file.size / 1024 / 1024 < 5
      if (!(isPNG || isJPG || isJPEG)) {
        this.$message.warning('图片仅支持jpg/png格式')
      }
      if (!isLimit5M) {
        this.$message.warning('请选择5M以内的图片')
      }
      return (isJPG || isPNG || isJPEG) && isLimit5M
    },
    handleRemove (file) {
      const index = this.formLabelAlign.pics.findIndex((item) => {
        // eslint-disable-next-line no-unused-expressions
        return item.pic === file.response.data.tmp_path
      })
      this.formLabelAlign.pics.splice(index, 1)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleSuccess (file) {
      this.formLabelAlign.pics.push({
        pic: file.data.tmp_path
      })
      console.log(file.data.tmp_path)
    },

    // 标签切换函数
    async Changetabs () {
      // eslint-disable-next-line no-constant-condition
      if (this.active === '2') {
        if (this.selectOptions.length <= 1) {
          this.$message.warning('请先选择分类')
          // eslint-disable-next-line no-return-assign
        } else {
          const res = await this.$http.get(`categories/${this.selectOptions[this.selectOptions.length - 1]}/attributes?sel=many`)
          if (res.data.data.length !== 0) {
            this.arrDyparams = res.data.data
            this.arrDyparams.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
            })
          } else {
            this.arrDyparams = []
          }
        }
      } else if (this.active === '3') {
        if (this.selectOptions.length <= 1) {
          this.$message.warning('请先选择分类')
        } else {
          const res = await this.$http.get(`categories/${this.selectOptions[this.selectOptions.length - 1]}/attributes?sel=only`)
          if (res.data.data.length !== 0) {
            this.arrStaparams = res.data.data
            console.log(this.arrStaparams)
          } else {
            this.arrStaparams = []
          }
        }
      }
    },
    async getGoodsSort () {
      const res = await this.$http.get('categories?type=3')
      this.options = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.alert{
  margin-top: 10px;
  margin-bottom: 10px;
}
.editor{
  height: 200px;
  margin: 10px;
}
</style>>
