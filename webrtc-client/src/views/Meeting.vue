<template>
  <div class="meeting">
    <label><input v-model="type" type="radio" value="join" />加入会议</label>
    <label><input v-model="type" type="radio" value="create" />创建会议</label>

    <template v-if="type === 'join'">
      <form onsubmit="return false">
        房间号：<input id="roomId" type="text" />
        <button>加入会议</button>
      </form>
    </template>
    <template v-else-if="type === 'create'">
      <form onsubmit="return false">
        房间号：<input id="roomId" type="text" /><br />
        容纳人数：<input id="maxUsersCount" type="text" /><br />
        <button>创建会议</button>
      </form>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "join",
    };
  },
};
</script>

<style lang="less" scoped>
.meeting {
  height: 100%;
}
form {
  text-align: center;
  padding-top: 100px;
}
</style>