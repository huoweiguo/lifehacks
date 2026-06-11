<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">收到的赞</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="like-list">
      <view v-for="(item, index) in likeList" :key="index" class="like-item">
        <view class="item-avatar">
          <text class="avatar-text">{{ item.author[0] }}</text>
        </view>
        <view class="item-content">
          <view class="item-header">
            <text class="item-author">{{ item.author }}</text>
            <text v-if="item.isFan" class="fan-badge">你的粉丝</text>
          </view>
          <text class="item-action">{{ item.action }} {{ item.time }}</text>
          <text v-if="item.content" class="item-comment">{{ item.content }}</text>
        </view>
        <view class="item-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'LikePage',
  data() {
    return {
      likeList: [
        {
          author: '宅家小能手',
          action: '赞了你的笔记',
          time: '2025-09-28',
          isFan: false
        },
        {
          author: '火炎焱',
          action: '赞了你的笔记',
          time: '2025-09-18',
          isFan: true
        },
        {
          author: '别凡好吗',
          action: '赞了你的笔记',
          time: '2025-09-18',
          isFan: false
        },
        {
          author: 'momo',
          action: '赞了你的评论',
          time: '2025-04-09',
          isFan: false,
          content: '还不如日本国足呢'
        }
      ]
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #1a1a1a;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background: #1a1a1a;
  height: 88rpx;
  z-index: 100;
}

.nav-left,
.nav-right {
  width: 80rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
}

.like-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.like-item {
  display: flex;
  align-items: flex-start;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #333;
}

.item-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.item-author {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

.fan-badge {
  font-size: 20rpx;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.item-action {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 6rpx;
}

.item-comment {
  font-size: 26rpx;
  color: #ccc;
  display: block;
  margin-top: 12rpx;
  padding-left: 16rpx;
  border-left: 2rpx solid #333;
}

.item-placeholder {
  width: 80rpx;
  height: 80rpx;
  background: #2a2a2a;
  border-radius: 8rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}
</style>
