<template>
	<view class="page">
		<view class="nav-bar">
			<view class="nav-center">
				<text class="nav-title">消息</text>
			</view>
		</view>

		<view class="tabs-bar">
			<view class="tab-item" :class="{ active: activeTab === 'likes' }" @click="goToLikes">
				<view class="tab-icon-wrap">
					<image class="tab-icon" src="/static/images/heart.png" mode="aspectFit" />
				</view>
				<text class="tab-text">点赞</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'comments' }" @click="goToComments">
				<view class="tab-icon-wrap">
					<image class="tab-icon" src="/static/images/message-xl.png" mode="aspectFit" />
				</view>
				<text class="tab-text">评论</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'collections' }" @click="goToCollections">
				<view class="tab-icon-wrap">
					<image class="tab-icon" src="/static/images/collect.png" mode="aspectFit" />
				</view>
				<text class="tab-text">收藏</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'follows' }" @click="goToFollows">
				<view class="tab-icon-wrap">
					<image class="tab-icon" src="/static/images/add-user.png" mode="aspectFit" />
				</view>
				<text class="tab-text">关注</text>
			</view>
		</view>

		<scroll-view scroll-y class="message-list">
			<view v-for="(item, index) in messages" :key="index" class="swipe-container">
				<view class="swipe-delete" @click="deleteMessage(index)">
					<text class="delete-text">删除</text>
				</view>
				<view class="message-item" :style="{ transform: `translateX(${swipeOffsets[index] || 0}px)` }"
					@touchstart="onTouchStart($event, index)" @touchmove="onTouchMove($event, index)"
					@touchend="onTouchEnd(index)">
					<view class="item-avatar">
						<text class="avatar-text">{{ item.author[0] }}</text>
					</view>
					<view class="item-content">
						<view class="item-header">
							<text class="item-author">{{ item.author }}</text>
							<text class="item-action">{{ item.action }}</text>
						</view>
						<text v-if="item.content" class="item-text">{{ item.content }}</text>
						<text class="item-time">{{ item.time }}</text>
					</view>
					<view v-if="item.cover" class="item-cover">
						<image class="cover-image" :src="item.cover" mode="aspectFill" />
					</view>
					<view v-if="item.showFollowBtn" class="follow-btn" @click.stop="handleFollowBack(index)">
						<text class="follow-text">回关</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'MessagePage',
	data() {
		return {
			activeTab: 'comments',
			swipeOffsets: {},
			startX: {},
			isSwiping: false,
			messages: [
				{
					author: '极简主义者',
					action: '评论了你的妙囊',
					content: '"这个关于厨房收纳的技巧真的很实用，帮我省了不少空间！"',
					time: '昨天 12:30',
					cover: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638'
				},
				{
					author: '生活策展人',
					action: '点赞了你的妙囊',
					time: '昨天 10:15',
					cover: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
				},
				{
					author: '设计迷',
					action: '开始关注了你',
					time: '前天 22:45',
					showFollowBtn: true
				},
				{
					author: '灵感收集者',
					action: '收藏了你的妙囊',
					time: '前天 18:00',
					cover: 'https://gips0.baidu.com/it/u=3088465159,2087256888&fm=3074&app=3074&f=JPEG?w=1298&h=1689&type=normal&func=T'
				},
				{
					author: '生活策展人',
					action: '点赞了你的妙囊',
					time: '昨天 10:15',
					cover: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
				},
				{
					author: '设计迷',
					action: '开始关注了你',
					time: '前天 22:45',
					showFollowBtn: true
				},
				{
					author: '灵感收集者',
					action: '收藏了你的妙囊',
					time: '前天 18:00',
					cover: 'https://gips0.baidu.com/it/u=3088465159,2087256888&fm=3074&app=3074&f=JPEG?w=1298&h=1689&type=normal&func=T'
				},
				{
					author: '生活策展人',
					action: '点赞了你的妙囊',
					time: '昨天 10:15',
					cover: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
				},
				{
					author: '生活策展人',
					action: '点赞了你的妙囊',
					time: '昨天 10:15',
					cover: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
				},
			]
		};
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		handleFollowBack(index) {
			const item = this.messages[index];
			if (item.showFollowBtn) {
				item.showFollowBtn = false;
				uni.showToast({
					title: '已关注',
					icon: 'success'
				});
			}
		},
		onTouchStart(e, index) {
			this.startX[index] = e.touches[0].clientX;
			this.isSwiping = true;
			this.resetOtherSwipe(index);
		},
		onTouchMove(e, index) {
			if (!this.isSwiping) return;
			const deltaX = e.touches[0].clientX - this.startX[index];
			if (deltaX < 0) {
				const offset = Math.max(-120, deltaX);
				this.$set(this.swipeOffsets, index, offset);
			} else {
				this.$set(this.swipeOffsets, index, Math.min(0, deltaX));
			}
		},
		onTouchEnd(index) {
			this.isSwiping = false;
			const offset = this.swipeOffsets[index] || 0;
			if (offset < -60) {
				this.$set(this.swipeOffsets, index, -120);
			} else {
				this.$set(this.swipeOffsets, index, 0);
			}
		},
		resetOtherSwipe(currentIndex) {
			Object.keys(this.swipeOffsets).forEach(index => {
				if (parseInt(index) !== currentIndex && this.swipeOffsets[index] !== 0) {
					this.$set(this.swipeOffsets, index, 0);
				}
			});
		},
		deleteMessage(index) {
			this.messages.splice(index, 1);
			this.$set(this.swipeOffsets, index, 0);
			uni.showToast({
				title: '删除成功',
				icon: 'success'
			});
		},
		goToLikes() {
			uni.navigateTo({
				url: '/pages/like/like'
			});
		},
		goToFollows() {
			uni.navigateTo({
				url: '/pages/follow/follow'
			});
		},
		goToComments() {
			uni.navigateTo({
				url: '/pages/comment/comment'
			});
		},
		goToCollections() {
			uni.navigateTo({
				url: '/pages/collection/collection'
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
	width: 36rpx;
	height: 36rpx;
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

.more-icon {
	font-size: 40rpx;
	color: #fff;
}

.tabs-bar {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 0;
	padding-top: calc(108rpx + constant(safe-area-inset-top));
	padding-top: calc(108rpx + env(safe-area-inset-top));
	background: #1a1a1a;
	border-bottom: 1rpx solid #333;
	box-sizing: border-box;
}

.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.tab-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #2a2a2a;
	border-radius: 16rpx;
}

// .tab-item.active .tab-icon-wrap {
// 	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// }

.tab-icon {
	width: 40rpx;
	height: 40rpx;
}

.tab-text {
	font-size: 22rpx;
	color: #999;
}

// .tab-item.active .tab-text {
// 	color: #fff;
// }

.message-list {
	height: calc(100vh - 220rpx - constant(safe-area-inset-top) - constant(safe-area-inset-bottom));
	height: calc(100vh - 220rpx - env(safe-area-inset-top) - env(safe-area-inset-bottom));
	padding: 20rpx;
	box-sizing: border-box;
}

.swipe-container {
	position: relative;
	overflow: hidden;
	margin-bottom: 8rpx;
}

.swipe-delete {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 120rpx;
	background: #ff4757;
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-text {
	font-size: 28rpx;
	color: #fff;
}

.message-item {
	display: flex;
	align-items: flex-start;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #333;
	background: #1a1a1a;
	transition: transform 0.2s ease;
}

.message-item:last-child {
	border-bottom: none;
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

.item-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.item-author {
	font-size: 28rpx;
	color: #fff;
	font-weight: 500;
}

.item-action {
	font-size: 26rpx;
	color: #999;
}

.item-text {
	font-size: 26rpx;
	color: #ccc;
	line-height: 1.5;
	margin-bottom: 8rpx;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.item-time {
	font-size: 22rpx;
	color: #666;
}

.item-cover {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	overflow: hidden;
	margin-left: 16rpx;
	flex-shrink: 0;
}

.cover-image {
	width: 100%;
	height: 100%;
}

.follow-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx;
	border: 1rpx solid #667eea;
	height: 50rpx;
	border-radius: 25rpx;
	margin-left: 16rpx;
	flex-shrink: 0;
}

.follow-text {
	font-size: 24rpx;
	color: #667eea;
}
</style>
