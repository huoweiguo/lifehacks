<template>
  <view class="page">
    <view class="nav-bar">
      <view class="nav-left" @click="toggleDrawer">
        <image class="drawer-icon-img" src="/static/images/menu.png" mode="aspectFit" />
      </view>
      <view class="nav-center">
        <text class="nav-title">我的</text>
      </view>
      <view class="nav-right"></view>
    </view>

    <view v-if="isDrawerOpen" class="drawer-mask" @click="closeDrawer"></view>
    <view class="drawer-panel" :class="{ 'show': isDrawerOpen }">
      <view class="drawer-content">
        <view class="drawer-card">
          <view class="drawer-item" @click="handleDrawerItem('addFriend')">
            <image class="drawer-icon" src="/static/images/addfriend.png" mode="aspectFit" />
            <text class="drawer-text">添加好友</text>
          </view>
        </view>
        <view class="drawer-card">
          <view class="drawer-item" @click="handleDrawerItem('addFriend')">
            <image class="drawer-icon" src="/static/images/account.png" mode="aspectFit" />
            <text class="drawer-text">账号与安全</text>
          </view>
          <view class="drawer-item" @click="handleDrawerItem('creator')">
            <image class="drawer-icon" src="/static/images/setting.png" mode="aspectFit" />
            <text class="drawer-text">通用设置</text>
          </view>
        </view>
        <view class="drawer-card">
          <view class="drawer-item" @click="handleDrawerItem('draft')">
            <image class="drawer-icon" src="/static/images/suggest.png" mode="aspectFit" />
            <text class="drawer-text">意见与建议</text>
          </view>
          <view class="drawer-item" @click="handleDrawerItem('activity')">
            <image class="drawer-icon" src="/static/images/about.png" mode="aspectFit" />
            <text class="drawer-text">关于我们</text>
          </view>
        </view>
        <view class="drawer-card">
          <view class="drawer-item" @click="handleDrawerItem('history')">
            <image class="drawer-icon" src="/static/images/switch.png" mode="aspectFit" />
            <text class="drawer-text">切换账号</text>
          </view>
          <view class="drawer-item" @click="handleDrawerItem('download')">
            <image class="drawer-icon" src="/static/images/logout.png" mode="aspectFit" />
            <text class="drawer-text">退出登录</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <view class="user-section">
        <!-- @click="changeAvatar" -->
        <view class="avatar-wrapper">
          <view class="user-avatar">
            <next-cropper :avatarSrc="imgurl1" :aspectRatio="1" :quality="1" selWidth="300rpx" selHeight="300rpx"
              expHeight="300rpx" expWidth="300rpx"
              :avatarStyle="{ width: '88rpx', height: '88rpx', borderRadius: '50%' }" @upload="myUpload" />
          </view>
          <view class="avatar-edit">
            <text class="edit-cross">+</text>
          </view>
        </view>
        <view class="user-info">
          <view v-if="!isEditingName" class="user-name-wrap">
            <text class="user-name">{{ userName }}</text>
            <image class="edit-icon" @click="startEditName" src="/static/images/edit.png" mode="aspectFit" />
          </view>
          <input v-else class="name-input" v-model="userName" placeholder="请输入昵称" @blur="saveName"
            :focus="isEditingName" />
          <text class="user-id">妙妙号: 12345678</text>
        </view>
      </view>
      <view class="bio-section">
        <view v-if="!isEditingBio" class="bio-content">
          <text class="user-bio">简介: {{ bioText }}</text>
          <image class="edit-btn" @click="startEditBio" src="/static/images/edit.png" mode="aspectFit" />
        </view>
        <input v-else class="bio-input" v-model="bioText" placeholder="请输入简介" @blur="saveBio" :focus="isEditingBio" />
      </view>

      <view class="stats-section">
        <view class="stat-item">
          <text class="stat-value">12</text>
          <text class="stat-label">发布</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">256</text>
          <text class="stat-label">获赞</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="goToMyFans">
          <text class="stat-value">1.2k</text>
          <text class="stat-label">粉丝</text>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" @click="goToMyTips">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/images/dp.png" mode="aspectFit" />
          </view>
          <text class="menu-text">我的秒囊</text>
          <image class="menu-arrow" src="/static/images/right.png" mode="aspectFit" />
        </view>
        <view class="menu-item" @click="goToMyComments">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/images/message-xl.png" mode="aspectFit" />
          </view>
          <text class="menu-text">我的评论</text>
          <image class="menu-arrow" src="/static/images/right.png" mode="aspectFit" />
        </view>
        <view class="menu-item" @click="goToHistory">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/images/history.png" mode="aspectFit" />
          </view>
          <text class="menu-text">浏览历史</text>
          <image class="menu-arrow" src="/static/images/right.png" mode="aspectFit" />
        </view>
        <view class="menu-item" @click="goToCollections">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/images/collect.png" mode="aspectFit" />
          </view>
          <text class="menu-text">我的收藏</text>
          <image class="menu-arrow" src="/static/images/right.png" mode="aspectFit" />
        </view>
        <view class="menu-item" @click="goToLikes">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/images/heart.png" mode="aspectFit" />
          </view>
          <text class="menu-text">我的点赞</text>
          <image class="menu-arrow" src="/static/images/right.png" mode="aspectFit" />
        </view>
      </view>

      <view class="community-section">
        <view class="community-content">
          <view class="community-info">
            <text class="community-title">加入妙囊社区</text>
            <text class="community-desc">分享你的生活智慧，赢取年度达人勋章。</text>
            <view class="upgrade-btn" @click="handleUpgrade">
              <text class="upgrade-text">立即升级</text>
            </view>
          </view>
          <view class="community-badge">
            <view class="badge-icon">
              <text class="badge-star">★</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import nextCropper from '@/uni_modules/next-cropper/components/next-cropper/next-cropper.vue';

export default {
  name: 'MinePage',
  components: {
    nextCropper
  },
  data() {
    return {
      bioText: '请完善个人简介',
      isEditingBio: false,
      isDrawerOpen: false,
      userName: '妙囊达人',
      isEditingName: false,
      imgurl1: '/static/images/avator.png',
    };
  },
  methods: {
    myUpload(rsp) {
      this.imgurl1 = rsp.path;
      console.log(rsp.path, res, '上传成功');
    },
    goToSettings() {
      uni.showToast({
        title: '设置',
        icon: 'none'
      });
    },
    goToMyTips() {
      uni.navigateTo({
        url: '/pages/myhacks/myhacks'
      });
    },
    goToMyComments() {
      uni.navigateTo({
        url: '/pages/mycomments/mycomments'
      });
    },
    goToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    },
    goToCollections() {
      uni.navigateTo({
        url: '/pages/mycollection/mycollection'
      });
    },
    goToLikes() {
      uni.navigateTo({
        url: '/pages/mylike/mylike'
      });
    },
    goToMyFans() {
      uni.navigateTo({
        url: '/pages/myfans/myfans'
      });
    },
    handleUpgrade() {
      uni.showToast({
        title: '立即升级',
        icon: 'none'
      });
    },
    startEditBio() {
      this.isEditingBio = true;
    },
    saveBio() {
      this.isEditingBio = false;
    },
    startEditName() {
      this.isEditingName = true;
    },
    saveName() {
      this.isEditingName = false;
      if (!this.userName.trim()) {
        this.userName = '妙囊达人';
      }
    },
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          uni.showToast({
            title: '头像更换成功',
            icon: 'success'
          });
        },
        fail: () => {
          uni.showToast({
            title: '取消更换',
            icon: 'none'
          });
        }
      });
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    closeDrawer() {
      this.isDrawerOpen = false;
    },
    handleDrawerItem(type) {
      this.closeDrawer();
      const titles = {
        addFriend: '添加好友',
        creator: '创作者中心',
        draft: '我的草稿',
        activity: '我的活动',
        history: '浏览记录',
        download: '我的下载',
        order: '订单',
        cart: '购物车',
        wallet: '钱包',
        miniprogram: '小程序',
        moment: '瞬间',
        scan: '扫一扫',
        help: '帮助与客服',
        settings: '设置'
      };
      uni.showToast({
        title: titles[type],
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

.drawer-icon-img {
  display: flex;
  align-items: center;
  width: 40rpx;
  height: 40rpx;
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
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
}

.settings-icon {
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
  min-height: calc(100vh - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
  min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: calc(88rpx + constant(safe-area-inset-top));
  padding-top: calc(88rpx + env(safe-area-inset-top));
  box-sizing: border-box;
}

.user-section {
  display: flex;
  align-items: center;
  padding: 30rpx;
  gap: 24rpx;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32rpx;
  height: 32rpx;
  background: #15ac07;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #2a2a2a;
}

.edit-cross {
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
  line-height: 1;
}

.avatar-text {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.user-info-section {
  flex: 1;
}

.user-name-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.user-name {
  font-size: 32rpx;
  color: #fff;
  display: block;
}

.edit-icon {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}

.name-input {
  font-size: 36rpx;
  color: #fff;
  background: transparent;
  border-bottom: 1rpx solid #666;
  padding-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.user-bio {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.bio-section {
  padding: 0 30rpx;
  margin-bottom: 24rpx;
}

.bio-content {
  display: flex;
  align-items: center;
}

.edit-btn {
  width: 30rpx;
  height: 30rpx;
  margin-left: 10rpx;
}

.bio-input {
  width: 100%;
  height: 60rpx;
  background: #2a2a2a;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #fff;
  box-sizing: border-box;
}

.stats-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 30rpx;
  padding: 30rpx;
  background: #2a2a2a;
  border-radius: 16rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background: #333;
}

.menu-section {
  margin: 24rpx 30rpx;
  background: #2a2a2a;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #333;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.menu-icon {
  width: 36rpx;
  height: 36rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #fff;
}

.menu-arrow {
  width: 24rpx;
  height: 24rpx;
}

.community-section {
  margin: 24rpx 30rpx;
  padding: 30rpx;
  background: #2a2a2a;
  border-radius: 16rpx;
}

.community-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.community-info {
  flex: 1;
}

.community-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 12rpx;
}

.community-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.upgrade-btn {
  background: #fff;
  padding: 16rpx 48rpx;
  border-radius: 8rpx;
  display: inline-flex;
}

.upgrade-text {
  font-size: 26rpx;
  color: #1a1a1a;
  font-weight: 500;
}

.community-badge {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-star {
  font-size: 40rpx;
  color: #666;
}

.menu-icon {
  font-size: 40rpx;
  color: #fff;
}

.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 60%;
  max-width: 480rpx;
  height: 100%;
  background: #2a2a2a;
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.drawer-panel.show {
  transform: translateX(0);
}

.drawer-content {
  flex: 1;
  padding: 30rpx;
  padding-top: calc(30rpx + constant(safe-area-inset-top));
  padding-top: calc(30rpx + env(safe-area-inset-top));
  overflow-y: auto;
}

.drawer-card {
  background: #333;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
}

.drawer-item {
  display: flex;
  align-items: center;
  padding: 28rpx 30rpx;
  gap: 24rpx;
  border-bottom: 1rpx solid #444;
  position: relative;
}

.drawer-item:last-child {
  border-bottom: none;
}

.drawer-icon {
  width: 34rpx;
  height: 34rpx;
}

.drawer-text {
  font-size: 28rpx;
  color: #fff;
  flex: 1;
}

.drawer-badge {
  background: #ff4757;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.drawer-footer {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #333;
  background: #2a2a2a;
}

.footer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.footer-icon {
  font-size: 44rpx;
}

.footer-text {
  font-size: 22rpx;
  color: #999;
}
</style>
