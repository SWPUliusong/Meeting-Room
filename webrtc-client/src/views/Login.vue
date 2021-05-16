<template>
  <div class="login">
    <form onsubmit="return false">
      用户名：<input v-model="userId" maxlength="10" type="text" />
      <button @click="createUser">创建用户</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
    };
  },
  methods: {
    createUser() {},
  },
  created() {
    console.log(123);
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
}
form {
  text-align: center;
  padding-top: 100px;
}
</style>