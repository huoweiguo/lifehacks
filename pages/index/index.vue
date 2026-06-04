<template>
	<view class="page">
		<view class="header">
			<view class="tabs">
				<view class="tab-item" :class="{ active: activeTab === 'discover' }" @click="activeTab = 'discover'">
					<text class="tab-text">发现</text>
					<view v-if="activeTab === 'discover'" class="tab-indicator"></view>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'follow' }" @click="activeTab = 'follow'">
					<text class="tab-text">关注</text>
					<view v-if="activeTab === 'follow'" class="tab-indicator"></view>
				</view>
			</view>
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input class="search-input" placeholder="搜索感兴趣的妙招" placeholder-class="search-placeholder" />
			</view>
		</view>

		<view class="category-section">
			<scroll-view class="category-scroll" scroll-x :show-scrollbar="false" :scroll-into-view="scrollToCategory">
				<view class="category-list">
					<view v-for="(item, index) in categories" :key="index" class="category-item" :id="'category-' + item.name"
						:class="{ active: activeCategory === item.name }" @click="activeCategory = item.name">
						<text class="category-text">{{ item.name }}</text>
					</view>
					<view class="category-more" @click="showCategoryDropdown = !showCategoryDropdown">
						<image class="category-more-icon" src="/static/images/down.png"></image>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-if="showCategoryDropdown" class="category-dropdown">
			<view class="dropdown-header">
				<text class="dropdown-title">全部分类</text>
			</view>
			<view class="dropdown-close" @click="showCategoryDropdown = false">
				<text class="close-icon">×</text>
			</view>
			<view class="dropdown-grid">
				<view v-for="(item, index) in allCategories" :key="index" class="dropdown-item"
					:class="{ active: activeCategory === item.name }" @click="selectCategory(item.name)">
					<text class="dropdown-text">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view v-if="isScrolled" class="float-category-btn" @click="showCategoryDropdown = true">
			<image src="/static/images/category.png" class="float-icon" />
			<text class="float-text">{{ activeCategory }}</text>
		</view>

		<view class="content">
			<view class="waterfall">
				<view class="waterfall-column">
					<view v-for="(item, index) in leftColumnData" :key="index" class="content-card" @click="goToContent(item)">
						<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }">
						</image>
						<view v-if="item.isVideo" class="video-play-btn">
							<text class="play-icon">▶</text>
						</view>
						<view class="card-content">
							<text class="card-title">{{ item.title }}</text>
							<view class="card-footer">
								<view class="user-info">
									<view class="avatar">
										<text class="avatar-text">{{ item.author[0] }}</text>
									</view>
									<text class="author-name">{{ item.author }}</text>
								</view>
								<view class="card-stats">
									<text class="stat-item">
										<text class="stat-icon">♡</text>
										<text class="stat-value">{{ item.likes }}</text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="waterfall-column">
					<view v-for="(item, index) in rightColumnData" :key="index" class="content-card" @click="goToContent(item)">
						<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }">
						</image>
						<view v-if="item.isVideo" class="video-play-btn">
							<image class="play-icon" src="/static/images/play.png" mode="aspectFit"></image>
						</view>
						<view class="card-content">
							<text class="card-title">{{ item.title }}</text>
							<view class="card-footer">
								<view class="user-info">
									<view class="avatar">
										<text class="avatar-text">{{ item.author[0] }}</text>
									</view>
									<text class="author-name">{{ item.author }}</text>
								</view>
								<view class="card-stats">
									<text class="stat-item">
										<text class="stat-icon">♡</text>
										<text class="stat-value">{{ item.likes }}</text>
									</text>
								</view>
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
			activeTab: 'discover',
			activeCategory: '推荐',
			showCategoryDropdown: false,
			scrollToCategory: '',
			isScrolled: false,
			categories: [
				{ name: '推荐' },
				{ name: '清洁去污' },
				{ name: '厨房技巧' },
				{ name: '衣物护理' },
				{ name: '收纳整理' },
				{ name: '居家保养' }
			],
			allCategories: [
				{ name: '推荐' },
				{ name: '清洁去污' },
				{ name: '厨房技巧' },
				{ name: '衣物护理' },
				{ name: '收纳整理' },
				{ name: '居家保养' },
				{ name: '宠物照料' },
				{ name: '个人护理' },
				{ name: '出行技巧' },
				{ name: '美食烹饪' },
				{ name: '健康养生' },
				{ name: '数码技巧' }
			],
			contentData: [
				{
					image: 'https://gips0.baidu.com/it/u=872613057,1184940587&fm=3074&app=3074&f=JPEG',
					title: '只需三招，让你的浴室瓷砖缝隙白亮如新',
					author: '家居达人...',
					likes: '1.2k',
					height: 500
				},
				{
					image: 'https://img10.360buyimg.com/img/jfs/t1/261060/15/2706/371326/676acb54F1245c97b/1d60d4b9dd46abb3.png',
					title: '换季衣物收纳，这种叠法最省空间！',
					author: '整理控悦悦',
					likes: '3.4k',
					height: 450,
					isVideo: true
				},
				{
					image: 'https://gips0.baidu.com/it/u=3088465159,2087256888&fm=3074&app=3074&f=JPEG?w=1298&h=1689&type=normal&func=T',
					title: '冰箱收纳技巧，让空间翻倍！',
					author: '美食小美',
					likes: '2.8k',
					height: 550
				},
				{
					image: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
					title: '绿植养护指南，新手也能养好',
					author: '植物爱好者',
					likes: '1.9k',
					height: 480
				},
				{
					image: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638',
					title: '厨房油污克星，轻松去除顽固油渍',
					author: '厨房达人',
					likes: '4.1k',
					height: 460,
					isVideo: true
				},
				{
					image: 'https://img1.baidu.com/it/u=2579339576,1528213261&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=608',
					title: '皮鞋保养秘籍，让爱鞋焕然一新',
					author: '时尚小管家',
					likes: '2.3k',
					height: 510
				},
				{
					image: 'https://gips0.baidu.com/it/u=275993497,652383184&fm=3074&app=3074&f=PNG',
					title: '衣物去渍技巧，轻松应对各种污渍',
					author: '生活小能手',
					likes: '3.7k',
					height: 470
				},
				{
					image: 'https://gips1.baidu.com/it/u=3186692341,3473062533&fm=3074&app=3074&f=JPEG',
					title: '卧室收纳妙招，打造温馨小窝',
					author: '居家设计师',
					likes: '2.5k',
					height: 490,
					isVideo: true
				}
			]
		}
	},
	computed: {
		leftColumnData() {
			return this.contentData.filter((_, index) => index % 2 === 0)
		},
		rightColumnData() {
			return this.contentData.filter((_, index) => index % 2 === 1)
		}
	},
	onPageScroll(e) {
		this.isScrolled = e.scrollTop > 96
	},
	methods: {
		selectCategory(name) {
			this.activeCategory = name
			this.showCategoryDropdown = false
			this.scrollToCategory = ''
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			})
			setTimeout(() => {
				this.scrollToCategory = 'category-' + name
			}, 350)
		},
		goToContent(item) {
			if (!item.isVideo) {
				uni.navigateTo({
					url: '/pages/content/content'
				})
			}
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #1a1a1a;
	padding-bottom: 120rpx;
}

.header {
	background: #1a1a1a;
	padding: constant(safe-area-inset-top, 24px) 30rpx 20rpx;
	padding: env(safe-area-inset-top, 24px) 30rpx 20rpx;
}

.tabs {
	display: flex;
	justify-content: center;
	margin-bottom: 30rpx;
	padding-top: 18rpx;
}

.tab-item {
	position: relative;
	padding: 0 40rpx;
	margin: 0 20rpx;
}

.tab-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #999;
}

.tab-item.active .tab-text {
	color: #fff;
}

.tab-indicator {
	position: absolute;
	bottom: -10rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 6rpx;
	background: #667eea;
	border-radius: 3rpx;
}

.search-bar {
	display: flex;
	align-items: center;
	background: #333;
	border-radius: 50rpx;
	padding: 20rpx 28rpx;
}

.search-icon {
	font-size: 32rpx;
	color: #999;
	margin-right: 16rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	background: transparent;
	color: #fff;
}

.search-placeholder {
	color: #666;
}

.category-section {
	background: #1a1a1a;
	padding: 0 30rpx;
}

.category-scroll {
	white-space: nowrap;
	border-bottom: 1rpx solid #555;
}

.category-list {
	display: inline-flex;
	align-items: center;
	height: 80rpx;
	gap: 20rpx;
}

.category-item {
	position: relative;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	color: #a0a0a0;
	height: 100%;
}

.category-item.active:after {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	content: '';
	width: 100%;
	height: 2rpx;
	background: #fff;
}

.category-item.active .category-text {
	color: #fff;
	font-weight: bold;
}

.category-text {
	font-size: 28rpx;
	color: #a0a0a0;
}

.category-more {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.more-icon {
	font-size: 24rpx;
	color: #fff;
}

.category-more-icon {
	width: 36rpx;
	height: 36rpx;
}

.category-dropdown {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #000;
	z-index: 200;
}

.dropdown-header {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: calc(constant(safe-area-inset-top)) 30rpx 18rpx;
	padding: calc(env(safe-area-inset-top)) 30rpx 18rpx;
	height: 80rpx;
	border-bottom: 2rpx solid #333;
}

.dropdown-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
}

.dropdown-close {
	position: fixed;
	right: 30rpx;
	bottom: 100rpx;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #333;
	border-radius: 50%;
	z-index: 300;
}

.close-icon {
	font-size: 40rpx;
	color: #fff;
	line-height: 1;
}

.dropdown-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 30rpx;
	gap: 20rpx;
}

.dropdown-item {
	width: calc(33.33% - 14rpx);
	padding: 12rpx 0;
	text-align: center;
	background: #333;
	border-radius: 8rpx;
}

.dropdown-item.active {
	background: #667eea;
}

.dropdown-text {
	font-size: 24rpx;
	color: #fff;
}

.dropdown-check {
	font-size: 28rpx;
	color: #667eea;
}

.float-category-btn {
	position: fixed;
	right: 30rpx;
	bottom: 200rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 16rpx;
	width: 54rpx;
	background: #2c2c2c;
	border-radius: 8rpx;
	box-shadow: 0 4rpx 20rpx rgba(255, 255, 255, 0.4);
	z-index: 10;
}

.float-icon {
	width: 38rpx;
	height: 38rpx;
}

.float-text {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.content {
	padding: 20rpx;
}

.waterfall {
	display: flex;
	gap: 20rpx;
}

.waterfall-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.content-card {
	background: #2a2a2a;
	border-radius: 20rpx;
	overflow: hidden;
	position: relative;
}

.video-play-btn {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
}

.play-icon {
	width: 26rpx;
	height: 26rpx;
	margin-left: 5rpx;
}

.card-image {
	width: 100%;
}

.card-content {
	padding: 20rpx;
}

.card-title {
	font-size: 28rpx;
	color: #fff;
	line-height: 1.5;
	margin-bottom: 16rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.avatar {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.avatar-text {
	font-size: 24rpx;
	color: #fff;
	font-weight: bold;
}

.author-name {
	font-size: 24rpx;
	color: #999;
}

.card-stats {
	display: flex;
	gap: 20rpx;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.stat-icon {
	font-size: 24rpx;
	color: #ff6b6b;
}

.stat-value {
	font-size: 24rpx;
	color: #999;
}
</style>