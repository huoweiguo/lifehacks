<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">收到的评论</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="comment-list">
      <view v-for="(item, index) in comments" :key="index" class="comment-item">
        <view class="item-avatar">
          <text class="avatar-text">{{ item.author[0] }}</text>
        </view>
        <view class="item-content">
          <view class="item-header">
            <text class="item-author">{{ item.author }}</text>
            <text v-if="item.isAuthor" class="author-badge">作者</text>
          </view>
          <text class="item-action">{{ item.action }}</text>
          <view class="item-text-wrap">
            <text class="item-text">{{ item.content }}</text>
            <text v-if="item.secondContent" class="item-text">{{ item.secondContent }}</text>
            <text v-if="item.thirdContent" class="item-text">{{ item.thirdContent }}</text>
          </view>
        </view>
        <view class="item-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'CommentPage',
  data() {
    return {
      comments: [
        {
          author: '小红书65B2FB93',
          action: '评论了你的笔记 04-02',
          content: '现在有吗',
          isAuthor: false
        },
        {
          author: '岭南',
          action: '评论了你的笔记 01-09',
          content: '111现在还有吗',
          secondContent: '111现在还有吗',
          isAuthor: false
        },
        {
          author: '喜爱美食的懒洋洋',
          action: '评论了你的笔记 01-07',
          content: '在哪里',
          secondContent: '在哪里',
          isAuthor: false
        },
        {
          author: '宅家小能手',
          action: '评论了你的笔记 2025-10-09',
          content: '原评论已删除',
          isAuthor: false
        },
        {
          author: '房票',
          action: '回复了你的评论 2025-09-21',
          content: '我在厦门，太远了',
          secondContent: '我在厦门，太远了',
          thirdContent: '六安，你可以私聊我',
          isAuthor: true
        },
        {
          author: '房票',
          action: '回复了你的评论 2025-09-21',
          content: '可以干，你在哪里',
          secondContent: '可以干，你在哪里',
          thirdContent: '业务员干不干',
          isAuthor: true
        },
        {
          author: '#',
          action: '评论了你的笔记 2025-09-20',
          content: '',
          isAuthor: false
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

.comment-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.comment-item {
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

.author-badge {
  font-size: 20rpx;
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.item-action {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.item-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.item-text {
  font-size: 28rpx;
  color: #ccc;
  line-height: 1.5;
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
