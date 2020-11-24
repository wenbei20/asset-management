<template>
  <div class="navbar">
    <div class="logo">
      <!-- 北京创想有限公司 -->
    </div>
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar>{{ UserName | getFirstName }}</el-avatar>
          <span class="UserName">{{ UserName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="showAddDialog = true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="showAddDialog" width="600px" :close-on-click-modal="false">
      <el-form ref="changepsw" :model="changepsw" label-position="right" style="padding-right:20px;" :rules="changepswRules">
        <el-form-item label="当前密码" prop="oldPower" :label-width="formLabelWidth">
          <el-input v-model="changepsw.oldPower" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="密码" prop="power" :label-width="formLabelWidth">
          <el-input v-model="changepsw.power" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePower" :label-width="formLabelWidth">
          <el-input v-model="changepsw.rePower" autocomplete="off" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="userDataPowerStatus === 'commit'" @click="showAddDialog=false">取 消</el-button>
        <el-button :loading="userDataPowerStatus === 'commit'" type="primary" @click="confirmDataPower">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updateUserPower } from '@/api/settings'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changepsw.rePower !== '') {
          this.$refs.changepsw.validateField('rePower')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changepsw.power) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      changepswRules: {
        oldPower: [
          { message: '请输入当前密码', trigger: 'blur', required: true }
        ],
        power: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        rePower: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      },
      showAddDialog: false,
      changepsw: {
        oldPower: '',
        power: '',
        rePower: ''
      },
      userDataPowerStatus: '',
      formLabelWidth: '100px'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState({
      UserName: state => state.user.userChname,
      reguserId: state => state.user.reguserId
    })
  },
  filters: {
    getFirstName(val) {
      return val ? val.substring(0, 1) : ''
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    confirmDataPower() {
      this.$refs.changepsw.validate(vali => {
        if (vali) {
          const query = {
            ...this.changepsw,
            reguserId: this.reguserId
          }
          this.userDataPowerStatus = 'commit'
          updateUserPower(query).then(async res => {
            if (res.code === 0) {
              this.$message({ type: 'success', message: '修改密码成功，请重新登录' })
              await this.$store.dispatch('user/logout')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            } else {
              this.$message({ type: 'error', message: res.msg })
              this.showAddDialog = false
            }
            this.userDataPowerStatus = ''
          }).catch(err => {
            console.log('err', err)
            this.$message({ type: 'error', message: '修改密码失败，请稍后再试' })
            this.showAddDialog = false
            this.userDataPowerStatus = ''
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logo{ float: left; width: 210px; height: 50px; line-height: 50px; text-align: center; font-size: 16px; font-weight: 800; color: #fff; background: rgba(0, 0, 0, .2);}
.navbar { height: 50px; overflow: hidden; position: relative; background: #324aa5; box-shadow: 0 1px 4px rgba(0,21,41,.08); color: #fff;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-avatar{ background: rgba(0, 0, 0, .3);}
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 15px;
          font-size: 12px;
          color: rgba(0, 0, 0, .3);
        }
      }
    }
  }
}
.UserName {
  display: inline-block;
  padding: 0 10px;
  vertical-align: middle;
  color: #Fff;
  position: relative;
  top: -16px;
}
</style>
