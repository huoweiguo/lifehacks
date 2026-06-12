<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">我的评论</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content" @scrolltolower="onScrollLower">
      <view v-if="comments.length > 0" class="comments-list">
        <view v-for="(item, index) in comments" :key="index" class="comment-item">
          <view class="item-header">
            <view class="user-avatar-wrap">
              <view class="user-avatar">
                <text class="avatar-text">{{ item.author[0] }}</text>
              </view>
            </view>
            <view class="user-info">
              <view class="name-row">
                <view class="name-left">
                  <text class="author-name">{{ item.author }}</text>
                  <text v-if="item.type === 'reply' && item.replyTo" class="reply-at">@{{ item.replyTo }}</text>
                </view>
                <view class="comment-actions" @click="showActions(item)">
                  <image class="actions-icon" src="/static/images/more-1.png" mode="aspectFit" />
                </view>
              </view>
              <text class="comment-content">{{ item.content }}</text>
              <view class="item-footer">
                <text class="comment-time">{{ item.time }}</text>
                <view class="interaction-info">
                  <view class="interaction-item" @click="handleLike(item)">
                    <image class="interaction-icon"
                      :src="item.liked ? '/static/images/heart-active.png' : '/static/images/heart.png'"
                      mode="aspectFit" />
                    <text class="interaction-text">{{ item.likes }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="item-source">
            <text class="source-label">来源于：</text>
            <text class="source-title">{{ item.targetTitle }}</text>
          </view>
        </view>

        <view v-if="hasMore" class="loading-more">
          <text class="loading-text">{{ loadingMore ? '加载中...' : '上滑加载更多' }}</text>
        </view>
        <view v-else class="loading-more">
          <text class="loading-text">已加载全部</text>
        </view>
      </view>

      <view v-else class="empty-state">
        <view class="empty-icon">
          <text class="icon-text">💬</text>
        </view>
        <text class="empty-text">暂无评论</text>
        <text class="empty-hint">去发表你的看法吧</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MyCommentsPage',
  data() {
    return {
      comments: [],
      page: 1,
      hasMore: true,
      loadingMore: false
    };
  },
  onLoad() {
    this.loadComments();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadComments() {
      const mockData = [
        {
          id: 1,
          type: 'comment',
          author: '妙囊达人',
          targetTitle: '夏日旅行必备攻略',
          content: '写得太好了！收藏了，下次旅行就用这个攻略',
          time: '2小时前',
          replies: 3,
          likes: 12,
          liked: false
        },
        {
          id: 2,
          type: 'reply',
          author: '妙囊达人',
          targetTitle: '简单又美味的家常菜做法',
          replyTo: '美食达人',
          content: '好的，周末试试做给家人吃',
          time: '昨天',
          replies: 5,
          likes: 28,
          liked: true
        },
        {
          id: 3,
          type: 'comment',
          author: '妙囊达人',
          targetTitle: '夏季穿搭指南',
          content: '学到了很多搭配技巧，谢谢分享！',
          time: '2天前',
          replies: 1,
          likes: 8,
          liked: false
        },
        {
          id: 4,
          type: 'reply',
          author: '妙囊达人',
          targetTitle: '居家健身计划',
          replyTo: '健身教练',
          content: '跟着练了一周，确实有效果！',
          time: '3天前',
          replies: 12,
          likes: 45,
          liked: true
        },
        {
          id: 5,
          type: 'comment',
          author: '妙囊达人',
          targetTitle: '推荐5本值得一读的好书',
          content: '书单收藏了，慢慢看',
          time: '1周前',
          replies: 2,
          likes: 15,
          liked: false
        },
        {
          id: 6,
          type: 'comment',
          author: '妙囊达人',
          targetTitle: '最新数码产品评测',
          content: '很详细的评测，帮我决定了买哪款',
          time: '1周前',
          replies: 8,
          likes: 32,
          liked: true
        },
        {
          id: 7,
          type: 'reply',
          author: '妙囊达人',
          targetTitle: '夏日旅行必备攻略',
          replyTo: '旅行达人',
          content: '请问酒店是提前多久订的？',
          time: '3小时前',
          replies: 1,
          likes: 5,
          liked: false
        }
      ];

      if (this.page === 1) {
        this.comments = mockData;
      } else {
        this.comments.push(...mockData.slice(0, 3));
      }

      this.loadingMore = false;
      if (this.page >= 3) {
        this.hasMore = false;
      }
    },
    onScrollLower() {
      if (this.loadingMore || !this.hasMore) return;
      this.loadingMore = true;
      this.page++;
      setTimeout(() => {
        this.loadComments();
      }, 1000);
    },
    handleLike(item) {
      item.liked = !item.liked;
      item.likes += item.liked ? 1 : -1;
    },
    showActions(item) {
      uni.showActionSheet({
        itemList: ['删除'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.deleteComment(item.id);
          }
        }
      });
    },
    deleteComment(id) {
      this.comments = this.comments.filter(item => item.id !== id);
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
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
  width: 40rpx;
  height: 40rpx;
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

.content {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.comments-list {
  padding: 20rpx;
}

.comment-item {
  background: #2a2a2a;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.user-avatar-wrap {
  margin-right: 16rpx;
  margin-bottom: 16rpx;
}

.user-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.author-name {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

.reply-at {
  font-size: 24rpx;
  color: #667eea;
}

.comment-content {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.5;
}

.target-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8rpx;
}

.target-label {
  font-size: 24rpx;
  color: #999;
}

.target-title {
  font-size: 26rpx;
  color: #667eea;
}

.reply-to {
  font-size: 24rpx;
  color: #999;
}

.comment-time {
  font-size: 22rpx;
  color: #666;
}

.comment-content {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.interaction-info {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.interaction-icon {
  width: 24rpx;
  height: 24rpx;
}

.interaction-text {
  font-size: 24rpx;
  color: #999;
}

.comment-actions {
  padding: 8rpx;
}

.actions-icon {
  width: 32rpx;
  height: 32rpx;
}

.item-source {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #333;
}

.source-label {
  font-size: 24rpx;
  color: #666;
}

.source-title {
  font-size: 24rpx;
  color: #999;
}

.loading-more {
  padding: 30rpx;
  text-align: center;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
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
  font-size: 60rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #fff;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #666;
}
</style>