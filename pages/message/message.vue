<template>
	<view class="page">
		<view class="header">
			<text class="title">我的收藏</text>
		</view>
		<view class="content">
			<view v-if="favorites.length === 0" class="empty-state">
				<text class="empty-icon">⭐</text>
				<text class="empty-text">还没有收藏任何内容</text>
				<text class="empty-hint">去首页看看有什么有趣的生活小技巧吧</text>
			</view>
			<view v-else class="favorite-list">
				<view class="favorite-item" v-for="(item, index) in favorites" :key="index">
					<image class="item-image" :src="item.image" mode="aspectFill"></image>
					<view class="item-content">
						<text class="item-title">{{ item.title }}</text>
						<text class="item-desc">{{ item.desc }}</text>
						<view class="item-footer">
							<text class="item-time">{{ item.time }}</text>
							<view class="item-tags">
								<text class="tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</text>
							</view>
						</view>
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
			favorites: [
				{
					image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cleaning%20hacks%20tips%20household%20cleaning&image_size=landscape_4_3',
					title: '如何快速去除咖啡渍',
					desc: '只需使用家中常见的白醋和食盐，就能轻松去除顽固的咖啡渍...',
					time: '2小时前',
					tags: ['清洁', '生活']
				},
				{
					image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=organizing%20clothes%20wardrobe%20tidy&image_size=landscape_4_3',
					title: '衣柜收纳的5个小妙招',
					desc: '利用空间最大化，让你的衣柜更加整洁有序...',
					time: '1天前',
					tags: ['收纳', '家居']
				}
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
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	padding: 40rpx 30rpx;
}

.title {
	font-size: 44rpx;
	font-weight: bold;
	color: #fff;
}

.content {
	padding: 30rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100rpx 0;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 16rpx;
}

.empty-hint {
	font-size: 26rpx;
	color: #999;
}

.favorite-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.favorite-item {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.item-image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 16rpx;
	flex-shrink: 0;
}

.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.item-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.item-desc {
	font-size: 24rpx;
	color: #999;
	flex: 1;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin-bottom: 12rpx;
}

.item-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-time {
	font-size: 22rpx;
	color: #ccc;
}

.item-tags {
	display: flex;
	gap: 12rpx;
}

.tag {
	font-size: 20rpx;
	color: #667eea;
	background: rgba(102, 126, 234, 0.1);
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}
</style>