<template>
	<view class="page">
		<view class="header">
			<view class="user-info">
				<view class="avatar">
					<text class="avatar-text">用</text>
				</view>
				<view class="user-detail">
					<text class="username">用户昵称</text>
					<text class="user-desc">热爱生活的小能手</text>
				</view>
			</view>
			<view class="stats">
				<view class="stat-item">
					<text class="stat-num">128</text>
					<text class="stat-label">收藏</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-num">32</text>
					<text class="stat-label">分享</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-num">156</text>
					<text class="stat-label">获赞</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="menu-section">
				<view class="menu-item" v-for="(item, index) in menuItems" :key="index">
					<text class="menu-icon">{{ item.icon }}</text>
					<text class="menu-text">{{ item.text }}</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
			<view class="menu-section">
				<view class="menu-item" v-for="(item, index) in settingsItems" :key="index">
					<text class="menu-icon">{{ item.icon }}</text>
					<text class="menu-text">{{ item.text }}</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			menuItems: [
				{ icon: '📝', text: '我的发布' },
				{ icon: '👍', text: '我的点赞' },
				{ icon: '💬', text: '我的评论' },
				{ icon: '👥', text: '我的关注' }
			],
			settingsItems: [
				{ icon: '🔔', text: '消息通知' },
				{ icon: '⚙️', text: '设置' },
				{ icon: 'ℹ️', text: '关于我们' }
			]
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #F5F5F5;
}

.header {
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	padding: 60rpx 30rpx 40rpx;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: rgba(255,255,255,0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid rgba(255,255,255,0.5);
}

.avatar-text {
	font-size: 48rpx;
	color: #fff;
	font-weight: bold;
}

.user-detail {
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
}

.user-desc {
	font-size: 24rpx;
	color: rgba(255,255,255,0.8);
}

.stats {
	display: flex;
	justify-content: space-around;
	background: rgba(255,255,255,0.2);
	border-radius: 20rpx;
	padding: 30rpx 0;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-num {
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
}

.stat-label {
	font-size: 24rpx;
	color: rgba(255,255,255,0.8);
	margin-top: 8rpx;
}

.stat-divider {
	width: 2rpx;
	background: rgba(255,255,255,0.3);
}

.content {
	padding: 30rpx;
}

.menu-section {
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 2rpx solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.menu-arrow {
	font-size: 36rpx;
	color: #ccc;
}
</style>