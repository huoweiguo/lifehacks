<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">收藏</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="collection-list">
      <view v-for="(item, index) in collections" :key="index" class="collection-item">
        <view class="item-avatar">
          <text class="avatar-text">{{ item.author[0] }}</text>
        </view>
        <view class="item-content">
          <view class="item-header">
            <text class="item-author">{{ item.author }}</text>
            <text v-if="item.isAuthor" class="author-badge">作者</text>
          </view>
          <text class="item-action">{{ item.action }}</text>
        </view>
        <view class="item-placeholder"></view>
      </view>

      <view v-if="hasMore" class="more-btn" @click="loadMore">
        <text class="more-text">{{ loadingMore ? '加载中...' : '查看更多' }}</text>
      </view>
      <view v-else class="more-btn">
        <text class="more-text">已加载全部</text>
      </view>

      <view v-if="collections.length === 0" class="empty-state">
        <view class="empty-icon">
          <image class="icon-text" src="/static/images/collect.png" mode="aspectFit" />
        </view>
        <text class="empty-text">暂无收藏</text>
        <text class="empty-hint">还没有用户收藏你的笔记</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'CollectionPage',
  data() {
    return {
      collections: [
        {
          author: '美食爱好者',
          action: '收藏了你的笔记 2025-10-15',
          isAuthor: false
        },
        {
          author: '旅行达人',
          action: '收藏了你的笔记 2025-10-10',
          isAuthor: false
        },
        {
          author: '生活小确幸',
          action: '收藏了你的笔记 2025-10-05',
          isAuthor: true
        },
        {
          author: '科技探索',
          action: '收藏了你的笔记 2025-09-28',
          isAuthor: false
        },
        {
          author: '摄影爱好者',
          action: '收藏了你的笔记 2025-09-20',
          isAuthor: false
        }
      ],
      loadingMore: false,
      hasMore: true
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadMore() {
      if (this.loadingMore || !this.hasMore) return;

      this.loadingMore = true;

      setTimeout(() => {
        const newCollections = [
          {
            author: '读书分享',
            action: '收藏了你的笔记 2025-09-15',
            isAuthor: false
          },
          {
            author: '运动达人',
            action: '收藏了你的笔记 2025-09-10',
            isAuthor: true
          },
          {
            author: '音乐爱好者',
            action: '收藏了你的笔记 2025-09-05',
            isAuthor: false
          }
        ];

        this.collections = [...this.collections, ...newCollections];
        this.loadingMore = false;

        if (this.collections.length >= 10) {
          this.hasMore = false;
        }
      }, 1000);
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

.collection-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.collection-item {
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120rpx;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.icon-text {
  width: 40rpx;
  height: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #666;
}

.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
}

.more-text {
  font-size: 26rpx;
  color: #667eea;
}
</style>
