<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <image class="back-icon" src="/static/images/left.png"></image>
      </view>
      <view class="nav-center">
        <view class="nav-avatar">
          <text class="avatar-text">{{ article.author[0] }}</text>
        </view>
        <text class="nav-author">{{ article.author }}</text>
        <view class="nav-follow-btn">
          <text class="follow-text">关注</text>
        </view>
      </view>
      <view class="nav-right"></view>
    </view>

    <swiper class="cover-swiper" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500"
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
      <swiper-item v-for="(img, index) in coverImages" :key="index" @click="previewImage(index)">
        <image class="cover-image" :src="img" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <view class="content">
      <view class="article-header">
        <text class="article-title">{{ article.title }}</text>
        <view class="article-tags">
          <view v-for="(tag, index) in article.tags" :key="index" class="tag-item">
            <text class="tag-text">#{{ tag }}</text>
          </view>
        </view>
        <view class="article-meta">
          <view class="meta-item">
            <text class="meta-text">发表于 {{ article.date }}</text>
          </view>
          <view class="meta-item">
            <image class="meta-icon" src="/static/images/view.png"></image>
            <text class="meta-text">{{ article.views }}</text>
          </view>
        </view>
      </view>

      <view class="article-body">
        <view v-for="(paragraph, index) in article.content" :key="index" class="paragraph">
          <text class="paragraph-text">{{ paragraph }}</text>
        </view>
        <view class="highlight-box">
          <text class="highlight-title">小贴士：</text>
          <text class="highlight-content">{{ article.tip }}</text>
        </view>
        <view v-for="(paragraph, index) in article.content2" :key="'p2-' + index" class="paragraph">
          <text class="paragraph-text">{{ paragraph }}</text>
        </view>
      </view>
    </view>

    <view class="comment-total">共{{ commentCount }}条评论</view>
    <CommentSection :comments="comments" />

    <view class="bottom-bar">
      <view class="bottom-input">
        <text class="input-field" placeholder-class="input-placeholder" @click="showMask">说点什么...</text>
      </view>
      <view class="bottom-actions">
        <view class="action-btn" :class="{ active: isLiked }" @click="toggleLike">
          <image v-if="isLiked" class="action-icon" src="/static/images/heart.png" mode="aspectFit" />
          <image v-else class="action-icon" src="/static/images/heart-active.png" mode="aspectFit" />
          <text class="action-count">{{ likeCount }}</text>
        </view>
        <view class="action-btn" :class="{ active: isCollected }" @click="toggleCollect">
          <image v-if="isLiked" class="action-icon" src="/static/images/collect.png" mode="aspectFit" />
          <image v-else class="action-icon" src="/static/images/collect-active.png" mode="aspectFit" />
          <text class="action-count">{{ collectCount }}</text>
        </view>
        <view class="action-btn" @click="shareArticle">
          <image class="action-icon" src="/static/images/forward.png" mode="aspectFit" />
          <text class="action-count">{{ shareCount }}</text>
        </view>
      </view>
    </view>

    <ReplyModal :visible="maskVisible" @close="hideMask" @send="handleReply" />
  </view>
</template>

<script>
import CommentSection from '@/components/CommentSection.vue';
import ReplyModal from '@/components/ReplyModal.vue';

export default {
  components: {
    CommentSection,
    ReplyModal
  },
  data() {
    return {
      maskVisible: false,
      isLiked: false,
      isCollected: false,
      likeCount: 622,
      collectCount: 134,
      shareCount: 89,
      commentCount: 234,
      coverImages: [
        "https://gips0.baidu.com/it/u=3088465159,2087256888&fm=3074&app=3074&f=JPEG?w=1298&h=1689&type=normal&func=T",
        "https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750",
        "https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638",
      ],
      article: {
        title: "冰箱收纳的新思维：空间利用率提升200%的秘诀",
        tags: ["生活技巧", "收纳整理", "居家生活"],
        date: "2024-10-24",
        views: "4.2k",
        likes: "622",
        author: "生活小达人",
        authorDesc: "专注生活技巧分享",
        content: [
          "很多人在整理冰箱时，习惯于把东西塞满整个空间。但这种做法不仅会让冰箱看起来杂乱无章，更重要的是，它会严重影响冰箱的制冷效率和食物的新鲜度。今天，我将为大家介绍一种全新的冰箱收纳思维，让你的冰箱空间利用率提升200%。",
          "首先，我们需要改变传统的收纳观念。很多人认为冰箱就是用来存放食物的地方，但实际上，冰箱更是一个需要精心规划的小仓库。通过合理的分区和收纳工具，我们可以让冰箱不仅看起来整洁美观，更能让每一寸空间都发挥最大的作用。",
        ],
        tip: "小贴士：冰箱的最佳储存温度是2-5摄氏度，定期清理过期食物，保持冰箱内部通风，可以有效延长食物保质期。",
        content2: [
          "利用收纳盒和保鲜盒是提高冰箱空间利用率的关键。选择透明的收纳盒，可以让你清楚地看到里面的食物，避免遗忘和浪费。同时，收纳盒还能防止食物串味，保持食物的新鲜。",
          "另外，冰箱门是一个很容易被忽视的黄金位置。冰箱门的最佳使用率在70%-80%为最佳，这不仅是为了美观，更是为了让冰箱的压缩机高效运行。",
        ],
      },
      comments: [
        {
          author: "美食小美",
          time: "2小时前",
          content: "学到了！原来冰箱还有这么多讲究，收藏了！",
          likes: "23",
          replies: [
            { author: "整理控悦悦", toAuthor: "美食小美", content: "对呀，我也觉得很实用！", time: "1小时前", likes: "8" },
            { author: "居家设计师", content: "收藏+1", time: "30分钟前", likes: "5" },
            { author: "生活小能手", toAuthor: "整理控悦悦", content: "好的，我也去试试！", time: "20分钟前", likes: "3" },
            { author: "厨房达人", content: "这个方法真的很棒", time: "15分钟前", likes: "6" },
          ],
        },
        {
          author: "整理控悦悦",
          time: "5小时前",
          content: "我家冰箱也是这样整理的，效果真的很好！强烈推荐大家都试试，现在一目了然。",
          likes: "45",
          replies: [
            { author: "美食小美", content: "太棒了！", time: "4小时前", likes: "12" },
            { author: "生活小达人", content: "感谢分享！", time: "3小时前", likes: "9" },
          ],
        },
        {
          author: "居家设计师",
          time: "昨天",
          content: "哈哈，收藏了！",
          likes: "12",
          replies: [],
        },
        {
          author: "生活小能手",
          time: "昨天",
          content: "试了一下，空间真的大了很多！",
          likes: "31",
          replies: [
            { author: "厨房达人", content: "效果这么好吗？", time: "昨天", likes: "7" },
            { author: "整理控悦悦", content: "是的，我也试过", time: "昨天", likes: "4" },
            { author: "数码小王子", content: "改天试试", time: "昨天", likes: "2" },
            { author: "美食小美", content: "期待你的反馈！", time: "昨天", likes: "6" },
            { author: "居家设计师", content: "我也准备试", time: "今天", likes: "1" },
          ],
        },
        {
          author: "厨房达人",
          time: "2天前",
          content: "一直都是这样整理，确实冰箱很有动力工作了。",
          likes: "28",
          replies: [],
        },
        {
          author: "数码小王子",
          time: "2天前",
          content: "这篇文章太棒了，收藏了好好看。",
          likes: "19",
        },
        {
          author: "健康养生家",
          time: "3天前",
          content: "收藏了，这个收纳盒在哪里买？",
          likes: "15",
        },
      ],
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    showMask() {
      this.maskVisible = true;
    },
    hideMask() {
      this.maskVisible = false;
    },
    handleReply(data) {
      uni.showToast({
        title: "发送成功",
        icon: "success",
      });
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.coverImages,
        current: this.coverImages[index],
      });
    },
    toggleLike() {
      this.isLiked = !this.isLiked;
      this.likeCount += this.isLiked ? 1 : -1;
      uni.showToast({
        title: this.isLiked ? "点赞成功" : "取消点赞",
        icon: "none",
      });
    },
    toggleCollect() {
      this.isCollected = !this.isCollected;
      this.collectCount += this.isCollected ? 1 : -1;
      uni.showToast({
        title: this.isCollected ? "收藏成功" : "取消收藏",
        icon: "none",
      });
    },
    shareArticle() {
      this.shareCount += 1;
      uni.showToast({
        title: "转发成功",
        icon: "none",
      });
    },
  },
};
</script>

<style>
.page {
  min-height: 100vh;
  background: #1a1a1a;
  padding-bottom: 120rpx;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: constant(safe-area-inset-top) 30rpx 0;
  padding: env(safe-area-inset-top) 30rpx 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  height: 88rpx;
}

.nav-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 38rpx;
  height: 38rpx;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-left: 10rpx;
}

.nav-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-author {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
  max-width: 150rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.nav-right {
  width: 60rpx;
}

.cover-swiper {
  width: 100%;
  height: 60vh;
  padding-top: calc(44px + constant(safe-area-inset-top));
  padding-top: calc(44px + env(safe-area-inset-top));
}

.cover-image {
  width: 100%;
  height: 100%;
}

.content {
  padding: 30rpx;
}

.article-header {
  margin-bottom: 30rpx;
}

.article-title {
  display: flex;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.tag-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  background: #333;
  height: 50rpx;
  border-radius: 25rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #51b5a6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-icon {
  width: 40rpx;
  height: 40rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #999;
}

.avatar-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.article-body {
  margin-bottom: 40rpx;
}

.paragraph {
  margin-bottom: 24rpx;
}

.paragraph-text {
  font-size: 30rpx;
  color: #ccc;
  line-height: 1.8;
}

.highlight-box {
  background: #2a2a2a;
  border-left: 6rpx solid #667eea;
  padding: 20rpx;
  margin-bottom: 24rpx;
  border-radius: 0 12rpx 12rpx 0;
}

.highlight-title {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.highlight-content {
  font-size: 28rpx;
  color: #ccc;
  line-height: 1.6;
}

.comment-total {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  margin: 20rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #2a2a2a;
  border-top: 1rpx solid #333;
}

.bottom-input {
  flex: 1;
  max-width: 400rpx;
}

.bottom-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20rpx;
  border-left: 1rpx solid #333;
  margin-left: 20rpx;
  gap: 32rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.action-btn.active {
  background: rgba(102, 126, 234, 0.1);
}

.action-icon {
  font-size: 36rpx;
  width: 32rpx;
  height: 32rpx;
}

.action-btn.active .action-icon {
  color: #667eea;
}

.action-count {
  font-size: 22rpx;
  color: #999;
}

.action-btn.active .action-count {
  color: #667eea;
}

.action-text {
  font-size: 20rpx;
  color: #999;
}

.action-btn.active .action-text {
  color: #667eea;
}

.bottom-input {
  flex: 1;
  display: flex;
  align-items: center;
}

.input-field {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  background: #333;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #666;
}

.input-placeholder {
  color: #666;
}
</style>
