<template>
  <view v-if="visible" class="popup-mask" @click="handleClose">
    <view class="popup-content" @click.stop>
      <view class="popup-header">
        <text class="popup-title">共{{ comments.length }}条评论</text>
        <view class="close-btn" @click="handleClose">
          <text class="close-icon">×</text>
        </view>
      </view>

      <scroll-view scroll-y class="popup-body">
        <CommentSection :comments="comments" />
      </scroll-view>

      <view class="popup-footer">
        <view class="footer-input" @click="showReply">
          <text class="input-placeholder">说点什么...</text>
        </view>
      </view>

      <ReplyModal :visible="showReplyModal" @close="hideReplyModal" @send="handleReply" />
    </view>
  </view>
</template>

<script>
import CommentSection from './CommentSection.vue';
import ReplyModal from './ReplyModal.vue';

export default {
  name: 'CommentPopup',
  components: {
    CommentSection,
    ReplyModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    comments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showReplyModal: false
    };
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    showReply() {
      this.showReplyModal = true;
    },
    hideReplyModal() {
      this.showReplyModal = false;
    },
    handleReply(data) {
      this.$emit('reply', data);
      this.hideReplyModal();
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.popup-content {
  width: 100%;
  max-height: 80vh;
  background: #1a1a1a;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
  display: flex;
  flex-direction: column;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #333;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.popup-count {
  font-size: 26rpx;
  color: #999;
  margin-left: 16rpx;
}

.close-btn {
  margin-left: auto;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 48rpx;
  color: #999;
}

.popup-body {
  flex: 1;
  padding: 20rpx 0;
  max-height: 60vh;
}

.popup-footer {
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  border-top: 1rpx solid #333;
  background: #1a1a1a;
  box-sizing: border-box;
}

.footer-input {
  display: flex;
  align-items: center;
  background: #333;
  height: 80rpx;
  padding: 0 30rpx;
  margin: 20rpx;
  border-radius: 40rpx;
  box-sizing: border-box;
}

.input-placeholder {
  font-size: 28rpx;
  color: #666;
}
</style>
