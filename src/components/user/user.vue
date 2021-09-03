<template>
<el-card class="box-card">
    <!-- 面包屑 -->
  <my-bread level1="用户管理" level2="用户列表"></my-bread>

  <!-- 搜索框 -->
    <el-row class="search">
    <el-col>
  <el-input @clear="loadUserList()" placeholder="请输入内容" v-model.lazy="search" clearable class="inputsearch">
    <el-button slot="append"
    @click="searchUser"
    icon="el-icon-search"
    ></el-button>
  </el-input>
  <el-button type="success" plain @click="addUsersBtn">添加用户</el-button>
  </el-col>
  </el-row>

  <!-- 添加用户弹窗 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" center :close-on-click-modal = "false" >
  <el-form :model="form" :rules="rules" ref="AddForm" status-icon>
    <el-form-item label="用户名" label-width="100px" prop="username">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="密 码" label-width="100px" prop="password">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="邮 箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="AddUser">确 定</el-button>
  </div>
</el-dialog>

<!-- 编辑用户弹窗 -->
 <el-dialog title="编辑信息" :visible.sync="dialogFormVisibleEdit" center :close-on-click-modal = "false" @close="closeDia()">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
      <el-input v-model="form.username" autocomplete="off" disabled></el-input>
    </el-form-item>

    <el-form-item label="邮 箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </div>
</el-dialog>
 <!-- 信息区 -->
  <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
       type=index
        label="#"
        width="60">
      </el-table-column>

      <el-table-column
        prop="username"
        label="姓名"
        width="80">
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

<!-- 时间显示 -->
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>

      </el-table-column>
      <!-- 用户状态切换 -->
      <el-table-column
        label="用户状态">
        <template slot-scope="scope">
        <el-switch
          @change="changeUserType(scope.row)"
          v-model="scope.row.mg_state"
           active-color="#13ce66"
           inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" circle @click="Editbtn(scope.row)"></el-button>
            <el-button size="mini" type="success" plain icon="el-icon-check" circle @click="roleCheckbtn(scope.row)"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" circle @click="DeleteUser(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 用户角色管理弹窗 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
    <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
      {{curUser}}
    </el-form-item>

    <el-form-item label="角色" label-width="100px">
      {{roleNameId}}
    <el-select v-model="roleNameId">
    <el-option label="请选择" :value="-1" disabled></el-option>
    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in userrules" :key="i"></el-option>
    </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="conRole()">确 定</el-button>
  </div>
</el-dialog>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages_number"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      // 列表请求参数（可用于特定搜索)
      search: '',
      // 列表请求参数
      pages_number: 1,
      page_size: 4,
      // 搜索得到的数据，用于展示
      tableData: [],
      total: -1, // 请求到的总数据条数
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // | username | 用户名称 | 不能为空 |
      // | password | 用户密码 | 不能为空 |
      // | email    | 邮箱     | 可以为空 |
      // | mobile   | 手机号   | 可以为空 |
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度应该在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度应该在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      //  用于接收角色列表数组
      userrules: [],
      //  select绑定的数据，用于控制输入框显示内容
      roleNameId: -1,
      curUser: '',
      curUserId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    closeDia () {
      this.form = {}
    },
    //  用户角色分配
    async conRole () {
      // 请求路径：users/:id/role
      // id     | 用户 ID  | 不能为空`参数是url参数:id` |
      // | rid    | 角色 id  | 不能为空`参数body参数`
      const res = await this.$http.put(`users/${this.curUserId}/role`, {
        rid: this.roleNameId
      })
      this.$message.success(res.data.meta.msg)
      this.dialogFormVisibleRole = false
    },

    async roleCheckbtn (role) {
      this.dialogFormVisibleRole = true
      this.curUser = role.username
      this.curUserId = role.id
      const res1 = await this.$http.get('roles')
      this.userrules = res1.data.data

      //  获取当前用户角色id >> rid
      const res2 = await this.$http.get(`users/${role.id}`)
      this.roleNameId = res2.data.data.rid
    },
    //  用户状态切换
    async changeUserType (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
      this.getUserList()
    },
    //  调出编辑页面弹窗
    Editbtn (userList) {
      this.dialogFormVisibleEdit = true
      this.form = userList
    },
    //  编辑用户信息
    async editUser () {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.form = {}
        this.dialogFormVisibleEdit = false
        this.getUserList()
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    },
    //  删除单个用户
    DeleteUser (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)
        if (res.data.meta.status === 200) {
          this.pages_number = 1
          this.getUserList()
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
    //  分页函数
    // @size-change   每页显示条数发生变化时触发
    // @current-change  当前页发生变化时触发
    // current-page 设置当前页时第几页
    // page-sizes 每页多少条数据数组
    // page-size 设置显示多少条
    handleSizeChange (val) {
      this.page_size = val
      this.pages_number = 1
      this.getUserList()
    },

    handleCurrentChange (val) {
      this.pages_number = val
      this.getUserList()
    },

    //  搜索特定用户
    searchUser () {
      this.getUserList()
    },

    //  清空搜索框时重新请求数据
    loadUserList () {
      this.getUserList()
    },
    // 添加用户
    addUsersBtn () {
      this.dialogFormVisibleAdd = true
    },
    AddUser () {
      this.$refs.AddForm.validate((valid) => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        this.$http.post('users', this.form).then(res => {
          const { data, meta: { msg, status } } = res.data
          if (status === 201) {
            this.$message.success(data.username + '用户' + msg + '!')
            this.getUserList()
            this.form = {}
          } else {
            this.$message.warning('用户创建失败！：' + msg)
          }
        })
        this.dialogFormVisibleAdd = false
      })
    },
    // 用户列表请求
    async getUserList () {
      // eslint-disable-next-line no-template-curly-in-string
      const res = await this.$http.get(`users?query=${this.search}&pagenum=${this.pages_number}&pagesize=${this.page_size}`)
      const { meta: { status, msg }, data: { users, total } } = res.data
      if (status === 200) {
        // 给表格渲染数据   给total赋值（获得的总数据条数）  提示用户
        this.tableData = users
        this.total = total
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card{
    width: 100%;
    height: 100%;
}
.search{
    margin-top: 15px;
    .inputsearch{
        padding-right: 10px;
        width:350px ;
    }
}
</style>>
