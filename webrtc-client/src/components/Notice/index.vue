<template>
  <div v-show="show" class="notice">{{ msg }}</div>
</template>

<script>
export default {
  name: "notice",
  data() {
    return {
      show: false,
      msg: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.notice {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  border-radius: 5px;
  background-color: #7ca4e0;
  max-width: 540px;
  color: #fff;
  word-break: break-all;
}
</style>
