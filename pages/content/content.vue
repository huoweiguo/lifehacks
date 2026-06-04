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
          <text class="follow-text">+关注</text>
        </view>
      </view>
      <view class="nav-right"></view>
    </view>

    <swiper class="cover-swiper" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
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

    <view class="comments-section">
      <view class="comments-header">
        <text class="comments-title">评论 ({{ comments.length }})</text>
      </view>
      <view v-for="(comment, index) in comments" :key="index" class="comment-item">
        <view class="comment-avatar">
          <text class="avatar-text">{{ comment.author[0] }}</text>
        </view>
        <view class="comment-content">
          <view class="comment-header">
            <text class="comment-author">{{ comment.author }}</text>
          </view>
          <view class="comment-text-row">
            <text class="comment-text">
              {{ comment.content }}
            </text>
          </view>
          <view class="comment-actions">
            <text class="comment-time"
              >{{ comment.time }}
              <text class="comment-reply">回复</text>
            </text>
            <view class="action-item">
              <image class="action-icon" src="/static/images/heart.png" mode="aspectFit" />
              <text class="action-text">{{ comment.likes }}</text>
            </view>
          </view>
          <view v-if="comment.replies && comment.replies.length > 0" class="replies-section">
            <view v-for="(reply, rIndex) in expandedReplies.includes(index) ? comment.replies : comment.replies.slice(0, 2)" :key="rIndex" class="reply-item">
              <view class="reply-avatar">
                <text class="reply-avatar-text">{{ reply.author[0] }}</text>
              </view>
              <view class="reply-content">
                <view class="reply-author-row">
                  <text class="reply-author">{{ reply.author }}</text>
                  <image v-if="reply.toAuthor" class="reply-arrow-icon" src="/static/images/react.png" mode="aspectFit" />
                  <text v-if="reply.toAuthor" class="reply-to-author">{{ reply.toAuthor }}</text>
                </view>
                <text class="reply-text">{{ reply.content }}</text>
                <view class="reply-actions">
                  <text class="reply-time">{{ reply.time }} <text class="reply-reply-btn">回复</text></text>
                  <view class="reply-action-item">
                    <image class="action-icon" src="/static/images/heart.png" mode="aspectFit" />
                    <text class="reply-action-text">{{ reply.likes || "0" }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="comment.replies.length > 2" class="expand-replies" @click="toggleReplies(index)">
              <view class="expand-line"></view>
              <text class="expand-text">{{ expandedReplies.includes(index) ? "收起" : `展开${comment.replies.length}条回复` }}</text>
              <view class="expand-line"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

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

    <view v-if="maskVisible" class="mask-layer" @click="hideMask">
      <view class="mask-content" @click.stop>
        <input
          class="mask-input-field"
          placeholder="有什么想法，展开说说"
          cursor-spacing="180rpx"
          placeholder-class="mask-input-placeholder"
          v-model="maskInputText"
          :focus="maskVisible"
          @click.stop
        />

        <view v-if="uploadedImages.length > 0" class="mask-images-preview">
          <view v-for="(img, index) in uploadedImages" :key="index" class="preview-image-item">
            <image class="preview-image" :src="img" mode="aspectFill" />
            <view class="preview-delete" @click.stop="removeImage(index)">
              <text class="delete-text">×</text>
            </view>
          </view>
        </view>

        <view class="mask-actions">
          <view class="mask-icons">
            <view class="mask-icon-btn" @click.stop="uploadImage">
              <image class="mask-icon" src="/static/images/pic.png" mode="aspectFit" />
            </view>
          </view>
          <view class="mask-send-btn" :class="{ active: maskInputText.trim() || uploadedImages.length > 0 }" @click.stop="sendReply">
            <text class="mask-send-text">发送</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputText: "",
      maskVisible: false,
      maskInputText: "",
      uploadedImages: [],
      isLiked: false,
      isCollected: false,
      likeCount: 622,
      collectCount: 134,
      shareCount: 89,
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
      expandedReplies: [],
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
      this.maskInputText = "";
      this.uploadedImages = [];
    },
    uploadImage() {
      uni.chooseImage({
        count: 9,
        success: (res) => {
          this.uploadedImages = this.uploadedImages.concat(res.tempFilePaths);
          uni.showToast({
            title: "图片上传成功",
            icon: "success",
          });
        },
        fail: () => {
          uni.showToast({
            title: "图片上传失败",
            icon: "none",
          });
        },
      });
    },
    removeImage(index) {
      this.uploadedImages.splice(index, 1);
    },
    sendReply() {
      if (this.maskInputText.trim() || this.uploadedImages.length > 0) {
        uni.showToast({
          title: "发送成功",
          icon: "success",
        });
        this.hideMask();
      }
    },
    sendComment() {
      if (this.inputText.trim()) {
        uni.showToast({
          title: "评论成功",
          icon: "success",
        });
        this.inputText = "";
      }
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.coverImages,
        current: this.coverImages[index],
      });
    },
    toggleReplies(index) {
      const idx = this.expandedReplies.indexOf(index);
      if (idx > -1) {
        this.expandedReplies.splice(idx, 1);
      } else {
        this.expandedReplies.push(index);
      }
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

.comments-section {
  padding: 0 30rpx;
}

.comments-header {
  margin-bottom: 20rpx;
}

.comments-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.comment-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #333;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.comment-author {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.comment-time {
  font-size: 22rpx;
  color: #666;
}

.comment-text-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.comment-text {
  flex: 1;
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
}

.comment-reply {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.replies-section {
  margin-top: 16rpx;
}

.reply-item {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.reply-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reply-avatar-text {
  font-size: 24rpx;
  color: #fff;
}

.reply-content {
  flex: 1;
  padding: 0 16rpx;
}

.reply-author-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.reply-author {
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.reply-arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

.reply-to-author {
  font-size: 24rpx;
  color: #999;
}

.reply-text {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.5;
  display: block;
  margin-bottom: 12rpx;
}

.reply-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.reply-time {
  font-size: 22rpx;
  color: #666;
}

.reply-action-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.reply-action-icon {
  font-size: 22rpx;
}

.reply-action-text {
  font-size: 22rpx;
  color: #666;
}

.reply-reply-btn {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.expand-replies {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 8rpx 0;
}

.expand-line {
  flex: 1;
  height: 1rpx;
  background: #333;
}

.expand-text {
  font-size: 22rpx;
  color: #fff;
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
}

.action-text {
  font-size: 24rpx;
  color: #999;
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

.send-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
}

.send-text {
  font-size: 28rpx;
  color: #999;
}

.send-btn.active .send-text {
  color: #fff;
}

.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.mask-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2a2a2a;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
}

.mask-input-field {
  background: #333;
  border-radius: 10rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 20rpx;
}

.mask-input-placeholder {
  color: #ccc;
}

.mask-images-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.preview-image-item {
  position: relative;
  width: 80rpx;
  height: 80rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.preview-delete {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-text {
  font-size: 32rpx;
  color: #fff;
  line-height: 1;
}

.mask-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mask-icons {
  display: flex;
  gap: 40rpx;
}

.mask-icon-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask-icon {
  width: 48rpx;
  height: 48rpx;
}

.mask-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28rpx;
  height: 60rpx;
  background: #999;
  border-radius: 30rpx;
  transition: all 0.3s;
}

.mask-send-btn.active {
  background: #e53935;
}

.mask-send-text {
  font-size: 28rpx;
  color: #333;
}

.mask-send-btn.active .mask-send-text {
  color: #fff;
}
</style>
