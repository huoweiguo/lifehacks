<template>
  <view v-if="visible" class="mask-layer" @click="handleClose">
    <view class="mask-content" @click.stop>
      <textarea class="mask-input-field" placeholder="有什么想法，展开说说。" cursor-spacing="420rpx"
        placeholder-class="mask-input-placeholder" v-model="inputText" :focus="visible" @click.stop />

      <view class="mask-images-preview">
        <view v-for="(img, index) in images" :key="index" class="preview-image-item">
          <image class="preview-image" :src="img" mode="aspectFill" />
          <view class="preview-delete" @click.stop="removeImage(index)">
            <text class="delete-text">×</text>
          </view>
        </view>
        <view v-if="images.length < 9" class="upload-btn" @click.stop="uploadImage">
          <text class="upload-icon">+</text>
        </view>
      </view>

      <view class="mask-actions">
        <view class="mask-emoji-btn" @click.stop="toggleEmoji">
          <image class="mask-emoji-icon" src="/static/images/emoji.png" mode="aspectFit" />
        </view>
        <view class="mask-send-btn" :class="{ active: inputText.trim() || images.length > 0 }" @click.stop="handleSend">
          <text class="mask-send-text">发送</text>
        </view>
      </view>

      <view v-if="showEmoji" class="mask-emoji-panel">
        <scroll-view scroll-x class="emoji-scroll">
          <view class="emoji-list">
            <view v-for="(emoji, index) in emojis" :key="index" class="emoji-item" @click.stop="insertEmoji(emoji)">
              <text class="emoji-text">{{ emoji }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ReplyModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputText: '',
      images: [],
      showEmoji: false,
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏']
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.inputText = '';
        this.images = [];
        this.showEmoji = false;
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    uploadImage() {
      uni.chooseImage({
        count: 9,
        success: (res) => {
          this.images = this.images.concat(res.tempFilePaths);
          uni.showToast({
            title: "图片上传成功",
            icon: "success",
          });
        },
        fail: () => {
          uni.showToast({
            title: "图片上传失败",
            icon: "none",
          });
        },
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },
    toggleEmoji() {
      this.showEmoji = !this.showEmoji;
    },
    insertEmoji(emoji) {
      this.inputText += emoji;
      this.showEmoji = false;
    },
    handleSend() {
      if (this.inputText.trim() || this.images.length > 0) {
        this.$emit('send', {
          text: this.inputText,
          images: this.images
        });
        this.handleClose();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.mask-content {
  width: 100%;
  background: #1a1a1a;
  padding: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.mask-input-field {
  width: 100%;
  background: #333;
  border-radius: 10rpx;
  height: 380rpx;
  padding: 16rpx 32rpx 200rpx;
  font-size: 28rpx;
  color: #fff;
  box-sizing: border-box;
}

.mask-input-placeholder {
  color: #ccc;
}

.mask-images-preview {
  position: relative;
  display: flex;
  gap: 16rpx;
  padding: 20rpx 0;
  overflow-x: auto;
  margin: -190rpx 30rpx 0;
  z-index: 10;
}

.preview-image-item {
  width: 140rpx;
  height: 140rpx;
  position: relative;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.preview-delete {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  width: 36rpx;
  height: 36rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-text {
  color: #fff;
}

.upload-btn {
  width: 140rpx;
  height: 140rpx;
  border: 2rpx dashed #ccc;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upload-icon {
  font-size: 48rpx;
  color: #ccc;
}

.mask-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.mask-emoji-btn {
  width: 60rpx;
  height: 60rpx;
}

.mask-emoji-icon {
  width: 100%;
  height: 100%;
}

.mask-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28rpx;
  height: 60rpx;
  background: #999;
  border-radius: 30rpx;
  transition: all 0.3s;
}

.mask-send-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mask-send-text {
  font-size: 26rpx;
  color: #333;
}

.mask-send-btn.active .mask-send-text {
  color: #fff;
}

.mask-emoji-panel {
  margin-top: 20rpx;
}

.emoji-scroll {
  white-space: nowrap;
}

.emoji-list {
  display: inline-flex;
  gap: 16rpx;
}

.emoji-item {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-text {
  font-size: 40rpx;
}
</style>
