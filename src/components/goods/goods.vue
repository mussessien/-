<template>
  <el-card style="height:100%">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 搜索框 -->
    <el-row class="search">
    <el-col>
  <el-input @clear="loadUserList()" placeholder="请输入内容" v-model.lazy="search" clearable class="inputsearch">
    <el-button slot="append"
    icon="el-icon-search"
    @click="seachGoods()"
    ></el-button>
  </el-input>
  <el-button type="success" plain @click="toGoodsadd()">添加用户</el-button>
  </el-col>
  </el-row>

  <!-- 列表信息展示 -->
    <el-table
    :data="tableData"
    border
    height="650"
    stripe
    style="width: 100%;margin-top: 15px;"
    >
    <el-table-column
      type="index"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="500">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格">
    </el-table-column>
       <el-table-column
      prop="goods_number"
      label="商品数量">
    </el-table-column>
       <el-table-column
      prop="add_time"
      label="添加时间">
      {{this.tableData.add_time |fmtdate}}
    </el-table-column>
     <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" circle @click="EditorGoods(scope.row)"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" circle @click="DeleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[8, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // tableData: [
      //   {
      //     username: '',
      //     email: '',
      //     mobile: ''
      //   }
      // ]
      tableData: [],
      search: '',
      total: 0,
      pagenum: 1,
      pagesize: 10
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 删除商品
    DeleteGoods (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`goods/${id}`)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.pagesnum = 1
          this.getGoodsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.warning('删除失败！')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加新商品
    toGoodsadd () {
      this.$router.push({ path: '/goodsadd' })
    },
    // 搜索商品
    seachGoods () {
      this.getGoodsList()
    },
    // 在清空搜索框时刷新列表
    loadUserList () {
      this.getGoodsList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList () {
      const res = await this.$http.get(`goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)

      if (res.data.meta.status === 200) {
        // 给表格渲染数据   给total赋值（获得的总数据条数）  提示用户
        this.tableData = res.data.data.goods
        this.total = res.data.data.total
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.search{
    margin-top: 15px;
    .inputsearch{
        padding-right: 10px;
        width:350px ;
    }
}
</style>
