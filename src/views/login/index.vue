<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-card shadow="never">
            <div class="title-container">
              <h3 class="title">
                <strong>登录</strong>
                <el-divider direction="vertical" />
                北京创想有限公司
              </h3>
            </div>
            <!--密码登录-->
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <el-button :loading="loading" type="primary" style="border-radius: 500px; width: 150px; margin-top: 30px;" @click.native.prevent="handleLogin">登 录</el-button>

            <div style=" margin-top: -30px; text-align: right;">
              <div class="tips">
                <a href="###">找回密码？</a>
              </div>
            </div>
            <!--/密码登录-->
          </el-card>
        </el-col>
        <el-col :span="13" :offset="1"><img :src="loginPic" class="login-pic"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { Message } from 'element-ui'
import loginPic from '@/assets/login/login-pic.png'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
       if (value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少需要6位'))
      } else {
        callback()
      }
    }
    return {
      loginPic,
      tabsActive: 'password',
      loginForm: {
        username: 'anykkk',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      input3: '',
      select: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    tabsChange(tab, event) {
      console.log(tab, event)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              console.log(this.$route)
              // 登录成功后，暂时先进入引导页面
               
              this.$router.push({ path: '/home' })
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((error) => {

             // console.log(error)
                  let err = ''
        // console.log('err', err.message === "Network Error")
         
              if(!error.message){
                  err = error
              }else  if(error.message === 'Network Error'){
                err = '网络连接失败，请稍后重试！'
              }else {
                err = '连接超时，请稍后重试！'
              }
              // Message.error(error || '登陆失败，请稍后重试！')
              this.$message({
                  type:'error',
                  message: err,
                  duration:2000
              })
              this.loading = false
            })
        } else {
          //console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#eee;
$light_gray:#333;
$cursor: #999;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-pic{ width: 100%;}
  .el-input {
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #f4f4f5;
    border-radius: 500px; padding: 0 10px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .el-card{ border: 0 none; margin-top: 100px;
    ::v-deep{
      .el-card__body{ padding: 20px 40px;}
    }
  }

  .el-tabs{
    ::v-deep{
      .el-tabs__nav-wrap{
        &:after{ background-color: transparent;}
      }
      .el-tabs__content{ padding: 10px 0; height: 310px;}
      .el-tabs__nav{ clear: both; margin: 0 auto;}
      .el-tabs__item{ font-size: 16px; font-weight: 400; color: #999;
        &.is-active{ color: #1890ff; font-weight: 800;}
      }
    }
  }

  .login-form { position: relative; width: 1360px; max-width: 100%; padding: 100px 0; margin: 0 auto; overflow: hidden;
    ::v-deep{
      .input-with-select{ width: 100%;
        .el-input-group__prepend{ background-color: transparent; border-color: transparent;}
        .el-select{
          .el-input{ width: 100%;}
        }
        .el-input-group__append{ border: 1px solid #f4f4f5; background: #fff; color: #333;}
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container { position: relative; text-align: center; padding: 10px 0; margin-bottom: 10px;
    .title { font-size: 26px; font-weight: 800; color: #324aa5; margin: 30px 0 20px 20px; text-align: left;
      strong{ color: #333; margin-right: 10px;}
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
