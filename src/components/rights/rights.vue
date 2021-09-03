<template>
  <el-card class="card">
      <my-bread level1='权限管理' level2='权限列表' class="header"></my-bread>
      <el-table
    :data="rightslist"
    border
    style="width: 100%"
    height="750"
    >
    <el-table-column
      type="index"
      label="序号"
      width="50"
      >
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径地址">
    </el-table-column>
    <el-table-column
      label="层级">
      <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
</template>

<script>

export default {
  data () {
    return {
      rightslist: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const res = await this.$http.get('rights/list')
      this.rightslist = res.data.data
      console.log(this.rightslist)
    }
  }
}
</script>

<style lang='less' scoped>
.card{
    height: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
}
.header{
    margin-bottom: 20px;
}
</style>
