<template>
	<view class="page">
		<view class="header">
			<text class="title">分类</text>
		</view>
		<view class="content">
			<view class="category-list">
				<view class="category-item" v-for="(item, index) in categories" :key="index">
					<view class="category-icon" :style="{background: item.bgColor}">
						<text class="icon-text">{{ item.icon }}</text>
					</view>
					<text class="category-name">{{ item.name }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			categories: [
				{ name: '清洁技巧', icon: '🧹', bgColor: '#FFE4E1' },
				{ name: '收纳整理', icon: '📦', bgColor: '#E0FFE0' },
				{ name: '美食烹饪', icon: '🍳', bgColor: '#FFF8E7' },
				{ name: '家居生活', icon: '🏠', bgColor: '#E7F3FF' },
				{ name: '健康养生', icon: '💪', bgColor: '#FFE7F3' },
				{ name: '数码技巧', icon: '📱', bgColor: '#E7FFF8' },
				{ name: '旅行攻略', icon: '✈️', bgColor: '#FFF0E7' },
				{ name: '学习方法', icon: '📚', bgColor: '#F3E7FF' }
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.category-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.category-item {
	width: 45%;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.category-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.icon-text {
	font-size: 48rpx;
}

.category-name {
	font-size: 28rpx;
	color: #333;
}
</style>