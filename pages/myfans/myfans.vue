<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">我的粉丝({{ fans.length }})</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="fans-list" @scrolltolower="loadMoreFans">
      <view v-if="loadingMore && fans.length === 0" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
      <view v-for="(item, index) in fans" :key="index" class="fans-item">
        <view class="item-avatar">
          <text class="avatar-text">{{ item.author[0] }}</text>
        </view>
        <view class="item-content">
          <text class="item-author">{{ item.author }}</text>
          <text class="item-stats">妙囊 {{ item.notes }} | 粉丝 {{ item.followers }}</text>
        </view>
        <view class="item-btn" :class="{ 'mutual': item.isMutual }" @click="handleFollow(index)">
          <text class="btn-text">{{ item.isMutual ? '互相关注' : '回关' }}</text>
        </view>
      </view>
      <view v-if="fans.length > 0">
        <view v-if="loadingMore" class="load-more">
          <text class="load-text">加载中...</text>
        </view>
        <view v-else-if="hasMore" class="load-more">
          <text class="load-text">上拉加载更多</text>
        </view>
        <view v-else class="load-more">
          <text class="load-text">已加载全部</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MyFansPage',
  data() {
    return {
      fans: [],
      loadingMore: false,
      hasMore: true,
      page: 1,
      isFirstLoad: true
    };
  },
  onLoad() {
    this.loadFans();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleFollow(index) {
      const item = this.fans[index];
      if (item.isMutual) {
        uni.showToast({
          title: '已互相关注',
          icon: 'none'
        });
      } else {
        item.isMutual = true;
        uni.showToast({
          title: '回关成功',
          icon: 'success'
        });
      }
    },
    loadFans() {
      if (this.loadingMore || !this.hasMore) return;

      this.loadingMore = true;

      setTimeout(() => {
        const newFans = [];
        const pageSize = 15;
        const defaultAuthors = ['春华秋实', '蚂蚁踩死大象', '天天', '火炎焱', '小红书 6854F04E'];

        for (let i = 0;i < pageSize;i++) {
          const totalIndex = this.fans.length + i;
          let author;
          let notes;
          let followers;
          let isMutual;

          if (this.isFirstLoad && i < defaultAuthors.length) {
            author = defaultAuthors[i];
            const defaultData = [
              { notes: 5, followers: 116, isMutual: false },
              { notes: 2, followers: 168, isMutual: false },
              { notes: 1, followers: 3, isMutual: false },
              { notes: 34, followers: 39, isMutual: false },
              { notes: 0, followers: 1135, isMutual: true }
            ];
            notes = defaultData[i].notes;
            followers = defaultData[i].followers;
            isMutual = defaultData[i].isMutual;
          } else {
            author = '用户' + (totalIndex + 1);
            notes = Math.floor(Math.random() * 50);
            followers = Math.floor(Math.random() * 500);
            isMutual = Math.random() > 0.7;
          }

          newFans.push({
            author,
            notes,
            followers,
            isMutual
          });
        }

        this.isFirstLoad = false;
        this.fans = [...this.fans, ...newFans];
        this.page++;

        if (this.page >= 3) {
          this.hasMore = false;
        }

        this.loadingMore = false;
      }, 1000);
    },
    loadMoreFans() {
      this.loadFans();
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


.fans-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.fans-item {
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

.item-author {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.item-stats {
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
  width: 140rpx;
  height: 56rpx;
  border-radius: 28rpx;
  border: 2rpx solid #ff4757;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-btn.mutual {
  border-color: #666;
}

.item-btn.follow {
  background: #ff4757;
  border-color: #ff4757;
}

.btn-text {
  font-size: 26rpx;
  color: #ff4757;
}

.item-btn.mutual .btn-text {
  color: #999;
}

.item-btn.follow .btn-text {
  color: #fff;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.load-more {
  padding: 24rpx;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #666;
}
</style>