<template>
  <view class="messageContainer">
    <CommonContainer title="消息" :showBack="false"></CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";

export default {
  components: {
    CommonContainer,
  },
  data() {
    return {};
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss">
.messageContainer {
}
</style>
