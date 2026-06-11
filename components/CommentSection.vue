<template>
  <view class="comments-section">
    <view v-for="(comment, index) in comments" :key="index" class="comment-item">
      <view class="comment-avatar">
        <text class="avatar-text">{{ comment.author[0] }}</text>
      </view>
      <view class="comment-content">
        <view class="comment-header">
          <text class="comment-author">{{ comment.author }}</text>
          <view class="comment-more" @click.stop="showCommentTips(index)">
            <text class="more-text">···</text>
          </view>
        </view>
        <view v-if="tipsIndex === index" class="comment-tips" @click.stop>
          <view class="tip-item" @click.stop="deleteComment(index)">
            <text class="tip-text">删除</text>
          </view>
          <view class="tip-item" @click.stop="openReportModal(index)">
            <text class="tip-text">举报</text>
          </view>
          <view class="tip-arrow"></view>
        </view>
        <view class="comment-text-row">
          <text class="comment-text">{{ comment.content }}</text>
        </view>
        <view class="comment-actions">
          <text class="comment-time">{{ comment.time }}
            <text class="comment-reply">回复</text>
          </text>
          <view class="action-item">
            <image class="action-icon" src="/static/images/heart.png" mode="aspectFit" />
            <text class="action-text">{{ comment.likes }}</text>
          </view>
        </view>
        <view v-if="comment.replies && comment.replies.length > 0" class="replies-section">
          <view
            v-for="(reply, rIndex) in (expandedReplies.includes(index) ? comment.replies : comment.replies.slice(0, 2))"
            :key="rIndex" class="reply-item">
            <view class="reply-avatar">
              <text class="reply-avatar-text">{{ reply.author[0] }}</text>
            </view>
            <view class="reply-content">
              <view class="reply-author-row">
                <view class="reply-author-info">
                  <text class="reply-author">{{ reply.author }}</text>
                  <image v-if="reply.toAuthor" class="reply-arrow-icon" src="/static/images/react.png"
                    mode="aspectFit" />
                  <text v-if="reply.toAuthor" class="reply-to-author">{{ reply.toAuthor }}</text>
                </view>
                <view class="reply-more" @click.stop="showReplyTips(index, rIndex)">
                  <text class="more-text">···</text>
                </view>
              </view>
              <view v-if="replyTipsIndex === `${index}-${rIndex}`" class="reply-tips" @click.stop>
                <view class="tip-item" @click.stop="deleteReply(index, rIndex)">
                  <text class="tip-text">删除</text>
                </view>
                <view class="tip-item" @click.stop="openReplyReportModal(index, rIndex)">
                  <text class="tip-text">举报</text>
                </view>
                <view class="tip-arrow"></view>
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
            <text class="expand-text">{{ expandedReplies.includes(index) ? "收起" : `展开${comment.replies.length}条回复`
            }}</text>
            <view class="expand-line"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 举报弹框 -->
    <view v-if="showReportModal" class="report-modal" @click="closeReportModal">
      <view class="report-content" @click.stop>
        <view class="report-header">
          <text class="report-title">举报评论</text>
          <view class="report-close" @click="closeReportModal">
            <text class="close-text">×</text>
          </view>
        </view>
        <view class="report-body">
          <text class="report-subtitle">举报原因</text>
          <view class="report-categories">
            <view v-for="(category, index) in reportCategories" :key="index" class="category-item"
              :class="{ active: selectedCategory === category.name }" @click="selectCategory(category)">
              <text class="category-text">{{ category.name }}</text>
            </view>
          </view>
          <view v-if="selectedCategory && selectedSubTypes.length > 0" class="report-subtypes">
            <text class="subtype-title">选择具体类型</text>
            <view class="subtype-list">
              <view v-for="(subtype, index) in selectedSubTypes" :key="index" class="subtype-item"
                :class="{ active: selectedSubtype === subtype }" @click="selectSubtype(subtype)">
                <text class="subtype-text">{{ subtype }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="report-footer">
          <view class="submit-btn" :class="{ active: selectedCategory }" @click="submitReport">
            <text class="submit-text">提交举报</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommentSection',
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tipsIndex: -1,
      replyTipsIndex: '',
      expandedReplies: [],
      showReportModal: false,
      reportCommentIndex: -1,
      selectedCategory: '',
      selectedSubtype: '',
      reportCategories: [
        { name: '谩骂攻击', subtypes: ['侮辱谩骂', '讽刺调侃', '地域攻击', '网暴我', '网暴他人'] },
        { name: '色情低俗', subtypes: ['色情资源', '低俗擦边', '性骚扰', '招嫖'] },
        { name: '违法违规', subtypes: ['黄赌毒', '非法金融服务', '泄露他人隐私', '其他违法行为'] },
        { name: '涉政敏感', subtypes: [] },
        { name: '未成年相关', subtypes: ['猥亵', '不良导向'] },
        { name: '广告营销', subtypes: ['虚假/夸大宣传', '售卖假冒商品', '刷单', '诱导互动'] },
        { name: '价值观不良导向', subtypes: ['危险行为', '自杀/自残', '引人不适'] },
        { name: '虚假冒充', subtypes: ['造谣传谣', '身份造假'] },
        { name: '我不感兴趣', subtypes: [] }
      ]
    };
  },
  computed: {
    selectedSubTypes() {
      const category = this.reportCategories.find(c => c.name === this.selectedCategory);
      return category ? category.subtypes : [];
    }
  },
  methods: {
    showCommentTips(index) {
      this.tipsIndex = this.tipsIndex === index ? -1 : index;
      this.replyTipsIndex = '';
    },
    deleteComment(index) {
      this.comments.splice(index, 1);
      this.tipsIndex = -1;
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
    },
    openReportModal(index) {
      this.reportCommentIndex = index;
      this.showReportModal = true;
      this.selectedCategory = '';
      this.selectedSubtype = '';
      this.tipsIndex = -1;
    },
    showReplyTips(cIndex, rIndex) {
      const key = `${cIndex}-${rIndex}`;
      this.replyTipsIndex = this.replyTipsIndex === key ? '' : key;
      this.tipsIndex = -1;
    },
    deleteReply(cIndex, rIndex) {
      this.comments[cIndex].replies.splice(rIndex, 1);
      this.replyTipsIndex = '';
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
    },
    openReplyReportModal(cIndex, rIndex) {
      this.reportCommentIndex = cIndex;
      this.showReportModal = true;
      this.selectedCategory = '';
      this.selectedSubtype = '';
      this.replyTipsIndex = '';
    },
    toggleReplies(index) {
      const idx = this.expandedReplies.indexOf(index);
      if (idx > -1) {
        this.expandedReplies.splice(idx, 1);
      } else {
        this.expandedReplies.push(index);
      }
    },
    closeReportModal() {
      this.showReportModal = false;
      this.selectedCategory = '';
      this.selectedSubtype = '';
    },
    selectCategory(category) {
      this.selectedCategory = category.name;
      this.selectedSubtype = '';
    },
    selectSubtype(subtype) {
      this.selectedSubtype = subtype;
    },
    submitReport() {
      if (!this.selectedCategory) {
        uni.showToast({
          title: '请选择举报原因',
          icon: 'none'
        });
        return;
      }
      this.closeReportModal();
      uni.showToast({
        title: '举报已提交',
        icon: 'success'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.comments-section {
  padding: 20rpx;
  padding-bottom: 80rpx;
}

.comments-header {
  margin-bottom: 20rpx;
}

.comments-title {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

.comment-item {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
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

.avatar-text {
  font-size: 28rpx;
  color: #fff;
}

.comment-content {
  flex: 1;
  position: relative;
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

.comment-more {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-text {
  font-size: 32rpx;
  color: #666;
}

.comment-tips {
  position: absolute;
  right: 0;
  top: 48rpx;
  background: #333;
  border-radius: 8rpx;
  padding: 8rpx 0;
  z-index: 100;
}

.tip-item {
  padding: 16rpx 40rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #fff;
}

.tip-arrow {
  position: absolute;
  right: 16rpx;
  top: -12rpx;
  width: 0;
  height: 0;
  border-left: 12rpx solid transparent;
  border-right: 12rpx solid transparent;
  border-bottom: 12rpx solid #333;
}

.comment-text-row {
  margin-bottom: 12rpx;
}

.comment-text {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-time {
  font-size: 22rpx;
  color: #666;
}

.comment-reply {
  margin-left: 16rpx;
  color: #999;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
}

.action-text {
  font-size: 22rpx;
  color: #666;
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
  position: relative;
}

.reply-author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.reply-author-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.reply-author {
  font-size: 24rpx;
  color: #999;
}

.reply-arrow-icon {
  width: 24rpx;
  height: 24rpx;
}

.reply-to-author {
  font-size: 24rpx;
  color: #999;
}

.reply-more {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reply-tips {
  position: absolute;
  right: 0;
  top: 36rpx;
  background: #333;
  border-radius: 8rpx;
  padding: 8rpx 0;
  z-index: 100;
}

.reply-text {
  font-size: 26rpx;
  color: #ccc;
  line-height: 1.5;
}

.reply-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.reply-time {
  font-size: 20rpx;
  color: #666;
}

.reply-reply-btn {
  margin-left: 16rpx;
  color: #999;
}

.reply-action-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.reply-action-text {
  font-size: 22rpx;
  color: #666;
}

.expand-replies {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 0;
}

.expand-line {
  flex: 1;
  height: 1rpx;
  background: #333;
}

.expand-text {
  font-size: 24rpx;
  color: #666;
}

/* 举报弹框样式 */
.report-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.report-content {
  width: 650rpx;
  background: #333;
  border-radius: 20rpx;
  overflow: hidden;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #444;
}

.report-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
}

.report-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-text {
  font-size: 40rpx;
  color: #999;
}

.report-body {
  padding: 30rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.report-subtitle {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 20rpx;
  display: block;
}

.report-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  height: 60rpx;
  background: #444;
  border-radius: 30rpx;
}

.category-item.active {
  background: #667eea;
}

.category-text {
  font-size: 26rpx;
  color: #fff;
}

.report-subtypes {
  padding-top: 20rpx;
  border-top: 1rpx solid #444;
}

.subtype-title {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.subtype-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.subtype-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  padding: 0 20rpx;
  background: #444;
  border-radius: 30rpx;
}

.subtype-item.active {
  background: #764ba2;
}

.subtype-text {
  font-size: 24rpx;
  color: #fff;
}

.report-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #444;
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #666;
  border-radius: 40rpx;
}

.submit-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.submit-text {
  font-size: 28rpx;
  color: #fff;
}
</style>
