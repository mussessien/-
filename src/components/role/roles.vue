<template>
  <el-card>
    <my-bread level1="权限列表" level2="角色列表"></my-bread>
    <el-button type="info" class="btnInfo" @click="dialogFormVisibleAddRole = true">添加角色</el-button>

    <!-- 角色表单 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand" width="100px">
        <template slot-scope="scope">
          <el-row v-for="(item1,index) in scope.row.children" :key="index">
            <el-col :span='4'>
              <!-- 一级权限 -->
        <el-tag type=" " closable @close="deleRight(scope.row,item1.id)"> {{item1.authName}} </el-tag>
        <i class="el-icon-arrow-right"></i>
        </el-col>

            <el-col :span='20'>
              <el-row v-for="(item2,index) in item1.children" :key="index">
                <el-col :span='4'>
                  <!-- 二级权限 -->
        <el-tag type="success" closable @close="deleRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
        <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span='20'>
                  <el-tag type="warning" closable v-for="(item3,index) in item2.children" :key="index" @close="deleRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" > </el-table-column>

      <el-table-column prop="roleName" label="姓名" >
      </el-table-column>

      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>

     <el-table-column  label="操作">
        <template slot-scope="scope">
          <!-- 删除角色 -->
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            circle
            @click="DetRole(scope.row)"
          ></el-button>
          <!-- 确认符号（授权） -->
          <el-button
            size="mini"
            type="success"
            plain
            icon="el-icon-check"
            circle
            @click="showRolelistDio(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
    title="修改权限"
    :visible.sync="centerDialogVisible"
    center>
        <el-tree
          ref="roletree"
          :data="rightslist"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkbox"
          :props="defaultProps">
        </el-tree>
      <span slot="footer" class="dialog-footer">
       <el-button @click="centerDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="changeRole()">确 定</el-button>
      </span>
   </el-dialog>

   <!-- 添加角色弹窗 -->
   <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAddRole" center :close-on-click-modal = "false" @close="clearRole()">
  <el-form :model="role"  ref="AddForm" status-icon :rules="rules">
    <el-form-item label="角色名称" label-width="100px" prop="roleName">
      <el-input v-model="role.roleName" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="角色描述" label-width="100px">
      <el-input v-model="role.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAddRole = false">取 消</el-button>
    <el-button type="primary" @click="AddRole()">确 定</el-button>
  </div>
</el-dialog>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      rightslist: [],
      centerDialogVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      checkbox: [],
      curRoleId: '',
      // 添加用户
      dialogFormVisibleAddRole: false,
      role: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoleLIst()
  },
  methods: {
    // 删除角色
    DetRole (scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`roles/${scope.id}`)
        this.$message.success(res.data.meta.msg)
        this.getRoleLIst()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 添加角色
    clearRole () {
      this.role.roleName = ''
      this.role.roleDesc = ''
    },
    async AddRole () {
      const res = await this.$http.post('roles', this.role)
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
      this.dialogFormVisibleAddRole = false
      this.getRoleLIst()
    },
    async getRoleLIst () {
      const res = await this.$http.get('roles')
      this.roleList = res.data.data
    },
    // 移除权限函数
    async deleRight (roleId, rightId) {
      const res = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
      roleId.children = res.data.data
    },
    showRolelistDio (scope) {
      this.getRightsList()
      this.curRoleId = scope.id
      const arrtemple = []
      scope.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrtemple.push(item3.id)
          })
        })
      })
      this.checkbox = arrtemple
      this.centerDialogVisible = true
    },
    async changeRole () {
      this.centerDialogVisible = false
      const arr1 = this.$refs.roletree.getCheckedKeys()
      const arr2 = this.$refs.roletree.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.curRoleId}/rights`, { rids: arr.join(',') })
      console.log(res)
      this.getRoleLIst()
    },
    async getRightsList () {
      const res = await this.$http.get('rights/tree')
      this.rightslist = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.btnInfo {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>>
