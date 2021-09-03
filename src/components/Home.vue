<template>
    <el-container class="container">
      <el-header class="header" height="80px">
          <el-row >
  <el-col :span="4" class="img">
          <img src="../assets/logo.png" alt="加载失败">
      </el-col>
  <el-col :span="18" class="middle">
          <h1>电商后台管理系统</h1>
      </el-col>
  <el-col :span="2" >
         <a class="loginout" href="" @click.prevent="exit">退出</a>
      </el-col>
</el-row>
      </el-header>
      <el-container>
        <el-aside width="300px" class="aside">
        <el-menu
        :router="true"
        :unique-opened="true">
      <el-submenu :index="' '+item1.order" v-for="(item1,index) in Menus" :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item1.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">{{item2.authName}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 右侧信息区域 -->
        <el-main class="main">
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      Menus: []
    }
  },
  created () {
    this.getMenus()
  },
  beforeCreate () {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('login')
    }
  },
  methods: {
    exit () {
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push('login')
    },
    async getMenus () {
      const res = await this.$http.get('menus')
      this.Menus = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.container{
    width: 100%;
    height: 100%;
}
.header{
    background-color: #b3c0d1;
}
.aside{
    background:#d3dce6;
}
.main{
    background-color: #e9eef3;
    height: 100%;
}
.img{
    height: 60px;
    img{
        height: 100%;
    }
}
.middle{
    text-align: center;
}
.loginout{
    line-height: 60px;
    text-decoration: none;
}
</style>>
