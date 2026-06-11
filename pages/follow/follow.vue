<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">新增关注</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="follow-list">
      <view v-for="(item, index) in followers" :key="index" class="follow-item">
        <view class="item-avatar">
          <text class="avatar-text">{{ item.author[0] }}</text>
        </view>
        <view class="item-content">
          <text class="item-author">{{ item.author }}</text>
          <text class="item-action">{{ item.action }}</text>
        </view>
        <view class="item-btn" :class="{ 'follow': !item.isFollowed }" @click="handleFollow(index)">
          <text class="btn-text">{{ item.isFollowed ? '回关' : '关注' }}</text>
        </view>
      </view>
      <view v-if="loadingMore" class="more-follow-btn">
        <text class="more-text">加载中...</text>
      </view>
      <view v-else-if="hasMore" class="more-follow-btn" @click="loadMoreFollowers">
        <text class="more-text">更多关注</text>
        <image class="more-icon" src="/static/images/arrow-down.png" mode="aspectFit" />
      </view>
      <view v-else class="more-follow-btn">
        <text class="more-text">已加载全部</text>
      </view>

      <view class="recommend-section">
        <view class="section-header">
          <view class="section-title">
            <text class="title-text">你可能感兴趣的人</text>
            <image class="info-icon" src="/static/images/info.png" mode="aspectFit" />
          </view>
          <text class="close-btn" @click="toggleRecommend">关闭</text>
        </view>

        <view v-for="(item, index) in recommendations" :key="index" class="recommend-item">
          <view class="item-avatar">
            <text class="avatar-text">{{ item.author[0] }}</text>
          </view>
          <view class="item-content">
            <view class="item-header">
              <text class="item-author">{{ item.author }}</text>
              <text v-if="item.isVerified" class="verified-icon">✓</text>
            </view>
            <text class="item-desc">{{ item.description }}</text>
          </view>
          <view class="item-actions">
            <view class="item-btn" @click="handleRecommendFollow(index)">
              <text class="btn-text">关注</text>
            </view>
            <view class="close-icon" @click="removeRecommend(index)">
              <text class="close-text">×</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'FollowPage',
  data() {
    return {
      followers: [
        {
          author: '春华秋实',
          action: '开始关注你了 01-17',
          isFollowed: true
        },
        {
          author: '蚂蚁踩死大象',
          action: '开始关注你了 2025-10-15',
          isFollowed: true
        },
        {
          author: '-1',
          action: '开始关注你了 2025-10-08',
          isFollowed: false
        },
        {
          author: '火炎焱',
          action: '开始关注你了 2025-09-18',
          isFollowed: true
        },
        {
          author: '弹着琴唱你爱的歌',
          action: '开始关注你了 2025-09-17',
          isFollowed: false
        }
      ],
      loadingMore: false,
      hasMore: true,
      page: 1,
      recommendations: [
        {
          author: '球衣历史图鉴',
          description: '体育运动内容热门门作者',
          isVerified: false
        },
        {
          author: '苏苏没烦恼',
          description: '生活记录内容热门门作者',
          isVerified: false
        },
        {
          author: '桃气鲜果屋',
          description: '美食内容热门门作者',
          isVerified: false
        },
        {
          author: '李银河',
          description: '社会学家',
          isVerified: true
        },
        {
          author: 'Stella思睿',
          description: '',
          isVerified: false
        }
      ]
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleFollow(index) {
      const item = this.followers[index];
      if (item.isFollowed) {
        uni.showToast({
          title: '已回关',
          icon: 'success'
        });
      } else {
        item.isFollowed = true;
        uni.showToast({
          title: '关注成功',
          icon: 'success'
        });
      }
    },
    handleRecommendFollow(index) {
      uni.showToast({
        title: '关注成功',
        icon: 'success'
      });
    },
    removeRecommend(index) {
      this.recommendations.splice(index, 1);
    },
    toggleRecommend() {
      this.recommendations = [];
    },
    loadMoreFollowers() {
      if (this.loadingMore || !this.hasMore) return;

      this.loadingMore = true;

      setTimeout(() => {
        const newFollowers = [
          {
            author: '热爱生活的人' + this.page,
            action: `开始关注你了 2025-0${this.page + 5}-${10 + this.page}`,
            isFollowed: Math.random() > 0.5
          },
          {
            author: '旅行家' + this.page,
            action: `开始关注你了 2025-0${this.page + 4}-${15 + this.page}`,
            isFollowed: Math.random() > 0.5
          },
          {
            author: '美食达人' + this.page,
            action: `开始关注你了 2025-0${this.page + 3}-${20 + this.page}`,
            isFollowed: Math.random() > 0.5
          }
        ];

        this.followers = [...this.followers, ...newFollowers];
        this.page++;

        if (this.page >= 3) {
          this.hasMore = false;
        }

        this.loadingMore = false;
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

.follow-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.follow-item {
  display: flex;
  align-items: center;
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
  gap: 8rpx;
}

.item-author {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
  display: block;
  margin-bottom: 6rpx;
}

.verified-icon {
  font-size: 22rpx;
  color: #1890ff;
  background: #fff;
  border-radius: 50%;
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.item-action {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.item-btn {
  width: 120rpx;
  height: 56rpx;
  border-radius: 28rpx;
  border: 2rpx solid #ff4757;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-btn.follow {
  background: #ff4757;
}

.btn-text {
  font-size: 26rpx;
  color: #ff4757;
}

.item-btn.follow .btn-text {
  color: #fff;
}

.more-follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
}

.more-text {
  font-size: 26rpx;
  color: #667eea;
}

.more-icon {
  width: 24rpx;
  height: 24rpx;
}

.recommend-section {
  padding-top: 30rpx;
  border-top: 16rpx solid #2a2a2a;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.title-text {
  font-size: 26rpx;
  color: #999;
}

.info-icon {
  width: 24rpx;
  height: 24rpx;
}

.close-btn {
  font-size: 24rpx;
  color: #999;
}

.recommend-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.close-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-text {
  font-size: 32rpx;
  color: #666;
}
</style>
