<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">我的妙招</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <scroll-view scroll-y class="content" @scrolltolower="onScrollLower">
      <view v-if="collections.length > 0" class="waterfall-container">
        <view class="waterfall-column">
          <view v-for="item in leftColumn" :key="item.id" class="waterfall-item" @click="handleItemClick(item)">
            <view class="item-image-wrap" :style="{ height: item.imageHeight + 'rpx' }">
              <image class="item-image" :src="item.image" mode="aspectFill" lazy-load />
              <view v-if="item.isVideo" class="play-icon">
                <text class="play-text">▶</text>
              </view>
            </view>
            <view class="item-info">
              <text class="item-title">{{ item.title }}</text>
              <view class="item-footer">
                <view class="author-info">
                  <view class="author-avatar">
                    <text class="avatar-text">{{ item.author[0] }}</text>
                  </view>
                  <text class="author-name">{{ item.author }}</text>
                </view>
                <view class="like-info">
                  <image class="like-icon" src="/static/images/heart.png" mode="aspectFit" />
                  <text class="like-count">{{ item.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="waterfall-column">
          <view v-for="item in rightColumn" :key="item.id" class="waterfall-item" @click="handleItemClick(item)">
            <view class="item-image-wrap" :style="{ height: item.imageHeight + 'rpx' }">
              <image class="item-image" :src="item.image" mode="aspectFill" lazy-load />
              <view v-if="item.isVideo" class="play-icon">
                <text class="play-text">▶</text>
              </view>
            </view>
            <view class="item-info">
              <text class="item-title">{{ item.title }}</text>
              <view class="item-footer">
                <view class="author-info">
                  <view class="author-avatar">
                    <text class="avatar-text">{{ item.author[0] }}</text>
                  </view>
                  <text class="author-name">{{ item.author }}</text>
                </view>
                <view class="like-info">
                  <image class="like-icon" src="/static/images/heart.png" mode="aspectFit" />
                  <text class="like-count">{{ item.likes }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="collections.length > 0 && hasMore" class="loading-more">
        <text class="loading-text">{{ loadingMore ? '加载中...' : '上滑加载更多' }}</text>
      </view>
      <view v-if="collections.length > 0 && !hasMore" class="loading-more">
        <text class="loading-text">已加载全部</text>
      </view>

      <view v-if="collections.length === 0" class="empty-state">
        <view class="empty-icon">
          <text class="icon-text">♡</text>
        </view>
        <text class="empty-text">暂无收藏</text>
        <text class="empty-hint">去发现有趣的内容吧</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MyCollectionPage',
  data() {
    return {
      collections: [],
      page: 1,
      hasMore: true,
      loadingMore: false
    };
  },
  computed: {
    leftColumn() {
      return this.collections.filter((_, index) => index % 2 === 0);
    },
    rightColumn() {
      return this.collections.filter((_, index) => index % 2 === 1);
    }
  },
  onLoad() {
    this.loadCollections();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.hasMore = true;
    this.loadingMore = false;
    this.loadCollections();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadCollections() {
      const mockData = [
        {
          id: 1,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=beautiful%20scenery%20mountain%20landscape&image_size=portrait_4_3',
          title: '夏日旅行必备攻略，带你玩转最美风景',
          author: '旅行达人',
          likes: 256,
          isVideo: false,
          imageHeight: 400
        },
        {
          id: 2,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=delicious%20food%20cooking%20recipe&image_size=portrait_16_9',
          title: '简单又美味的家常菜做法，学会就是赚到',
          author: '美食博主',
          likes: 512,
          isVideo: true,
          imageHeight: 350
        },
        {
          id: 3,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fashion%20clothing%20style&image_size=portrait_4_3',
          title: '夏季穿搭指南，让你成为街头焦点',
          author: '时尚达人',
          likes: 892,
          isVideo: false,
          imageHeight: 450
        },
        {
          id: 4,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fitness%20workout%20exercise&image_size=portrait_16_9',
          title: '居家健身计划，不用出门也能练出好身材',
          author: '健身教练',
          likes: 1234,
          isVideo: true,
          imageHeight: 380
        },
        {
          id: 5,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=book%20reading%20library&image_size=portrait_4_3',
          title: '推荐5本值得一读的好书，提升自我',
          author: '读书分享',
          likes: 342,
          isVideo: false,
          imageHeight: 420
        },
        {
          id: 6,
          image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=technology%20gadgets%20review&image_size=portrait_16_9',
          title: '最新数码产品评测，看看哪款适合你',
          author: '科技测评',
          likes: 756,
          isVideo: true,
          imageHeight: 360
        }
      ];

      if (this.page === 1) {
        this.collections = mockData;
      } else {
        this.collections.push(...mockData.slice(0, 3));
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
        this.loadCollections();
      }, 1000);
    },
    handleItemClick(item) {
      uni.showToast({
        title: `查看：${item.title}`,
        icon: 'none'
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
  justify-content: center;
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

.waterfall-container {
  display: flex;
  padding: 20rpx;
  gap: 16rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.waterfall-item {
  background: #2a2a2a;
  border-radius: 16rpx;
  overflow: hidden;
}

.item-image-wrap {
  position: relative;
  width: 100%;
}

.item-image {
  width: 100%;
  height: 100%;
}

.play-icon {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-text {
  color: #fff;
  font-size: 24rpx;
  margin-left: 4rpx;
}

.item-info {
  padding: 20rpx;
}

.item-title {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.author-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 20rpx;
  color: #fff;
}

.author-name {
  font-size: 24rpx;
  color: #999;
}

.like-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.like-icon {
  width: 24rpx;
  height: 24rpx;
}

.like-count {
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
  color: #666;
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