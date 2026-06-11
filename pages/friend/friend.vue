<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">朋友动态</text>
      </view>
    </view>

    <scroll-view scroll-y class="history-list" @scrolltolower="loadMore" :scroll-with-animation="true">
      <view class="waterfall-container">
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

      <view v-if="loading" class="loading-more">
        <text class="loading-text">加载中...</text>
      </view>
      <view v-else-if="!hasMore && displayList.length > 0" class="loading-more">
        <text class="loading-text">已加载全部</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'HistoryPage',
  data() {
    return {
      pageSize: 8,
      currentPage: 1,
      loading: false,
      hasMore: true,
      allHistory: [],
      displayList: []
    };
  },
  computed: {
    leftColumn() {
      return this.displayList.filter((_, index) => index % 2 === 0);
    },
    rightColumn() {
      return this.displayList.filter((_, index) => index % 2 === 1);
    }
  },
  created() {
    this.initData();
    this.loadPage(1);
  },
  methods: {
    initData() {
      const mockData = [];
      const titles = [
        '成都写真',
        '生命不该在沉默中腐朽，应该在激情中燃烧！#极限...',
        '#生活实用手工',
        '盘点搞笑视频名场面瞬间',
        '夏日旅行攻略',
        '美食探店分享',
        '健身打卡日常',
        '读书心得分享',
        '科技新品评测',
        '摄影技巧教学',
        '美食制作教程',
        '旅行vlog合集',
        '宠物日常记录',
        '美妆护肤分享',
        '游戏直播精彩片段',
        '职场经验分享'
      ];
      const authors = [
        '颜嘉嘉Rachel...',
        '红牛极限运动',
        '生活实用手工',
        '小鹿',
        '旅行达人',
        '美食探店',
        '健身教练',
        '书虫小明',
        '科技达人',
        '摄影爱好者',
        '美食大厨',
        '旅行博主',
        '宠物爱好者',
        '美妆达人',
        '游戏主播',
        '职场导师'
      ];
      const images = [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20in%20green%20dress%20outdoor%20portrait&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20view%20of%20blue%20inflatable%20raft%20on%20water&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=DIY%20craft%20workshop%20handmade%20project&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=funny%20comedy%20video%20scene%20chinese%20man&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=summer%20travel%20beach%20vacation&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20food%20restaurant%20dish&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gym%20fitness%20workout%20training&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=reading%20books%20library%20study&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=technology%20gadget%20review%20product&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photography%20camera%20equipment%20lens&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cooking%20chef%20kitchen%20recipe&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20vlog%20adventure%20exploration&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20cat%20dog%20animal&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=makeup%20beauty%20cosmetics%20skincare&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20streaming%20esports%20computer&image_size=portrait_4_3',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=office%20business%20meeting%20work&image_size=portrait_4_3'
      ];

      for (let i = 0;i < 40;i++) {
        mockData.push({
          id: i + 1,
          image: images[i % images.length],
          title: titles[i % titles.length],
          author: authors[i % authors.length],
          likes: this.formatLikes(Math.floor(Math.random() * 10000) + 100),
          isVideo: Math.random() > 0.5,
          imageHeight: Math.floor(Math.random() * 200) + 300
        });
      }

      this.allHistory = mockData;
    },

    formatLikes(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
      } else {
        return num.toString();
      }
    },

    loadPage(page) {
      if (this.loading) return;

      this.loading = true;

      setTimeout(() => {
        const start = (page - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newItems = this.allHistory.slice(start, end);

        if (newItems.length === 0) {
          this.hasMore = false;
        } else {
          this.displayList = [...this.displayList, ...newItems];
          this.currentPage = page;
          if (end >= this.allHistory.length) {
            this.hasMore = false;
          }
        }

        this.loading = false;
      }, 800);
    },

    loadMore() {
      if (this.loading || !this.hasMore) return;
      this.loadPage(this.currentPage + 1);
    },

    goBack() {
      uni.navigateBack();
    },

    handleItemClick(item) {
      uni.showToast({
        title: `查看: ${item.title}`,
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
  padding: 0 30rpx;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background: #1a1a1a;
  height: 88rpx;
  z-index: 100;
}

.nav-left,
.nav-right {
  position: relative;
  width: 80rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  z-index: 100;
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
}

.manage-text {
  font-size: 28rpx;
  color: #fff;
  padding: 8rpx 20rpx;
  border: 1rpx solid #333;
  border-radius: 6rpx;
}

.nav-center {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  line-height: 88rpx;
  text-align: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
}

.history-list {
  height: calc(100vh - 88rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  height: calc(100vh - 88rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
}

.waterfall-container {
  display: flex;
  padding: 0 15rpx;
  gap: 15rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.waterfall-item {
  background: #2a2a2a;
  border-radius: 12rpx;
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
  bottom: 12rpx;
  right: 12rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-text {
  font-size: 20rpx;
  color: #fff;
  margin-left: 4rpx;
}

.item-info {
  padding: 16rpx;
}

.item-title {
  font-size: 24rpx;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.author-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 18rpx;
  color: #fff;
  font-weight: bold;
}

.author-name {
  font-size: 22rpx;
  color: #666;
}

.like-info {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.like-icon {
  width: 24rpx;
  height: 24rpx;
}

.like-count {
  font-size: 22rpx;
  color: #666;
}

.loading-more {
  padding: 30rpx;
  text-align: center;
}

.loading-text {
  font-size: 24rpx;
  color: #666;
}
</style>
