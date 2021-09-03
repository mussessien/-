<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单登录页面 -->
      <el-form label-width="0" class="froms" :model="loginForm" :rules="rules" ref="loginFormRef">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-icon-test35" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-icon-test26" v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="success" @click="login">登陆</el-button>
          <el-button type="info"  @click="resetloginFormRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度应该在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度应该在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetloginFormRef () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        this.$http.post('login', this.loginForm).then(res => {
          const { data, meta: { msg, status } } = res.data
          if (status !== 200) {
            // eslint-disable-next-line no-undef
            if (status === 400) return this.$message.error('登录失败，' + msg + '!')
            this.$message.error('登录失败，' + msg + '!')
          }
          // 如果登录成功：0、保存token值 1、跳转页面   2、提示登陆成功
          localStorage.setItem('token', data.token)
          this.$router.push('/')
          this.$message.success('登录成功，欢迎' + data.username)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avater_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    background-color: white;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.froms{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
}
</style>
