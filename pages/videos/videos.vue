<template>
  <view class="video-page">
    <swiper class="video-swiper" :current="currentIndex" @change="onSwiperChange" :vertical="true" :circular="false"
      :autoplay="false" :interval="0" :duration="300">
      <swiper-item v-for="(video, index) in videos" :key="index">
        <view class="video-container">
          <image class="video-cover" :src="video.cover" mode="aspectFit" />
          <view class="video-overlay">
            <view class="play-btn" @click="togglePlay">
              <text class="play-icon">{{ isPlaying ? '⏸' : '▶' }}</text>
            </view>
          </view>
        </view>

        <!-- 顶部悬浮栏 -->
        <view class="top-bar">
          <view class="nav-left" @click="goBack">
            <image class="back-icon" src="/static/images/left.png"></image>
          </view>
        </view>

        <!-- 右侧悬浮信息 -->
        <view class="right-info">
          <view class="info-item" @click="showMore">
            <image class="fixed-icon" src="/static/images/more.png"></image>
          </view>
          <view class="info-item" @click="toggleLike(index)">
            <image class="fixed-icon" v-if="isLiked" src="/static/images/heart-st.png"></image>
            <image class="fixed-icon" v-else src="/static/images/heart-active-st.png"></image>
            <text class="info-count">{{ video.likes }}</text>
          </view>
          <view class="info-item" @click="showComments(index)">
            <image class="fixed-icon" src="/static/images/message.png"></image>
            <text class="info-count">{{ video.comments }}</text>
          </view>
          <view class="info-item" @click="toggleCollect(index)">
            <image class="fixed-icon" v-if="isCollected" src="/static/images/collect-st.png"></image>
            <image class="fixed-icon" v-else src="/static/images/collect-active-st.png"></image>
            <text class="info-count">{{ video.collects }}</text>
          </view>
          <view class="info-item" @click="showComments(index)">
            <image class="fixed-icon" src="/static/images/share.png"></image>
            <text class="info-count">{{ video.comments }}</text>
          </view>
        </view>

        <!-- 底部悬浮信息 -->
        <view class="bottom-info">
          <view class="user-info">
            <view class="user-avatar">
              <text class="avatar-text">{{ video.author[0] }}</text>
            </view>
            <view class="user-detail">
              <text class="user-name">{{ video.author }}</text>
              <view class="follow-btn" :class="{ followed: isFollowed }" @click="toggleFollow">
                <view class="nav-follow-btn">
                  <text class="follow-text">{{ isFollowed ? '已关注' : '关注' }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="video-title">
            <text class="title-text">{{ video.title }}</text>
          </view>
          <view class="video-desc">
            <text class="desc-text">{{ video.description }}</text>
          </view>
          <view class="video-tags">
            <text v-for="(tag, tIndex) in video.tags" :key="tIndex" class="tag-item-text">{{ tag }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <CommentPopup :visible="showCommentPopup" :comments="currentComments" @close="hideCommentPopup"
      @reply="handleCommentReply" />
  </view>
</template>

<script>
import CommentPopup from '@/components/CommentPopup.vue';

export default {
  name: 'VideoPage',
  components: {
    CommentPopup
  },
  data() {
    return {
      currentIndex: 0,
      isPlaying: false,
      isLiked: false,
      isCollected: false,
      isFollowed: false,
      inputText: '',
      showCommentPopup: false,
      currentComments: [],
      videos: [
        {
          id: 1,
          cover: 'https://gips0.baidu.com/it/u=3088465159,2087256888&fm=3074&app=3074&f=JPEG?w=1298&h=1689&type=normal&func=T',
          author: '妙囊小达人',
          title: '如何用一个柠檬让你的厨房焕然一新？',
          description: '这个方法我试了10次，每次都非常灵！🍋这个方法我试了10次，每次都非常灵！',
          tags: ['#生活小妙囊', '#居家清洁'],
          likes: '2.4k',
          comments: '158',
          collects: '892'
        },
        {
          id: 2,
          cover: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
          author: '生活小能手',
          title: '10个让生活更方便的小技巧',
          description: '这些技巧真的太实用了，赶紧收藏起来吧！',
          tags: ['#生活技巧', '#实用'],
          likes: '1.8k',
          comments: '96',
          collects: '523'
        },
        {
          id: 3,
          cover: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638',
          author: '美食达人',
          title: '简单又美味的早餐做法',
          description: '早起10分钟就能做好，营养又健康！',
          tags: ['#美食', '#早餐'],
          likes: '3.2k',
          comments: '234',
          collects: '1.2k'
        }
      ]
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    shareVideo() {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      });
    },
    showMore() {
      uni.showActionSheet({
        itemList: ['不感兴趣'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showToast({ title: '已标记', icon: 'none' });
          }
        }
      });
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying;
      uni.showToast({
        title: this.isPlaying ? '播放中' : '已暂停',
        icon: 'none'
      });
    },
    toggleLike(index) {
      const video = this.videos[index];
      if (!this.isLiked) {
        const num = parseFloat(video.likes);
        const suffix = video.likes.includes('k') ? 'k' : '';
        video.likes = (num + 1) + suffix;
        this.isLiked = true;
        uni.showToast({ title: '点赞成功', icon: 'none' });
      } else {
        const num = parseFloat(video.likes);
        const suffix = video.likes.includes('k') ? 'k' : '';
        video.likes = (num - 1) + suffix;
        this.isLiked = false;
        uni.showToast({ title: '取消点赞', icon: 'none' });
      }
    },
    toggleCollect(index) {
      const video = this.videos[index];
      this.isCollected = !this.isCollected;
      if (this.isCollected) {
        const num = parseFloat(video.collects);
        const suffix = video.collects.includes('k') ? 'k' : '';
        video.collects = (num + 1) + suffix;
        uni.showToast({ title: '收藏成功', icon: 'none' });
      } else {
        const num = parseFloat(video.collects);
        const suffix = video.collects.includes('k') ? 'k' : '';
        video.collects = (num - 1) + suffix;
        uni.showToast({ title: '取消收藏', icon: 'none' });
      }
    },
    toggleFollow() {
      this.isFollowed = !this.isFollowed;
      uni.showToast({
        title: this.isFollowed ? '关注成功' : '已取消关注',
        icon: 'none'
      });
    },
    showComments(index) {
      this.currentComments = [
        {
          author: '用户A',
          time: '2小时前',
          content: '这个视频太棒了！',
          likes: '23',
          replies: [
            { author: '用户B', content: '确实不错', time: '1小时前', likes: '5' }
          ]
        },
        {
          author: '用户C',
          time: '5小时前',
          content: '学到了很多',
          likes: '45',
          replies: []
        },
        {
          author: '用户C',
          time: '5小时前',
          content: '跟我以前用的方法虽然不一样，但是效果是一样的！',
          likes: '45',
          replies: [
            { author: '张培培', content: '确实不错', time: '1小时前', likes: '5' },
            { author: '李海清', content: '我有更好的建议!', time: '50分钟前', likes: '0' },
            { author: 'mix1302', content: '我用过这种方法，效果一般，但是比以前的方法简单了！', time: '33分钟前', likes: '15' }
          ]
        },
        {
          author: '用户C',
          time: '5小时前',
          content: '这个视频太棒了！',
          likes: '158',
          replies: []
        },
        {
          author: '用户C',
          time: '5小时前',
          content: '学到了很多',
          likes: '489',
          replies: []
        },
        {
          author: '用户D',
          time: '昨天',
          content: '收藏了！',
          likes: '12',
          replies: []
        }
      ];
      this.showCommentPopup = true;
    },
    hideCommentPopup() {
      this.showCommentPopup = false;
    },
    handleCommentReply(data) {
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      });
    },
    onSwiperChange(e) {
      this.currentIndex = e.detail.current;
      this.isPlaying = false;
      this.isLiked = false;
      this.isCollected = false;
    }
  }
};
</script>

<style>
.video-page {
  width: 100%;
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.video-swiper {
  width: 100%;
  height: 100%;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-cover {
  width: 100%;
  height: 100%;
  max-width: 100vw;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.play-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  font-size: 48rpx;
  color: #fff;
  margin-left: 8rpx;
}

/* 顶部悬浮栏 */
.top-bar {
  position: absolute;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  z-index: 100;
}

.nav-left {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
}

.back-icon {
  width: 38rpx;
  height: 38rpx;
}

.nav-right {
  display: flex;
  gap: 20rpx;
}

.nav-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  font-size: 32rpx;
  color: #fff;
}

/* 右侧悬浮信息 */
.right-info {
  position: absolute;
  right: 20rpx;
  bottom: 350rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  z-index: 100;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.info-icon {
  font-size: 56rpx;
}

.info-count {
  font-size: 24rpx;
  color: #fff;
}

/* 底部悬浮信息 */
.bottom-info {
  position: absolute;
  left: 20rpx;
  right: 120rpx;
  bottom: 80rpx;
  z-index: 100;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
}

.user-detail {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.user-name {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

.video-title {
  margin-bottom: 8rpx;
}

.title-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
}

.video-desc {
  margin-bottom: 12rpx;
}

.desc-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-item-text {
  font-size: 26rpx;
  color: #667eea;
}


.input-placeholder {
  color: #666;
}


.fixed-icon {
  width: 76rpx;
  height: 76rpx;
}

.nav-follow-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20rpx;
  background: #fa8c16;
  height: 44rpx;
  border-radius: 22rpx;
}

.follow-text {
  font-size: 24rpx;
  color: #fff;
}
</style>
