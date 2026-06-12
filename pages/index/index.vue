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
		</view>

		<view class="category-section" v-if="activeTab === 'discover'">
			<scroll-view class="category-scroll" scroll-x :show-scrollbar="false" :scroll-into-view="scrollToCategory"
				@scroll="onCategoryScroll">
				<view class="category-list">
					<view v-for="(item, index) in categories" :key="index" class="category-item" :id="'category-' + item.name"
						:class="{ active: activeCategory === item.name }" @click="selectCategory(item.name)">
						<text class="category-text">{{ item.name }}</text>
					</view>
					<view class="category-more" @click="showCategoryDropdown = !showCategoryDropdown">
						<image class="category-more-icon" src="/static/images/down.png"></image>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-if="showCategoryDropdown" class="category-dropdown" @click="showCategoryDropdown = false">
			<view class="dropdown-header" @click.stop>
				<text class="dropdown-title">全部分类</text>
			</view>
			<view class="dropdown-close" @click.stop="showCategoryDropdown = false">
				<text class="close-icon">×</text>
			</view>
			<view class="dropdown-grid" @click.stop>
				<view v-for="(item, index) in allCategories" :key="index" class="dropdown-item"
					:class="{ active: activeCategory === item.name }" @click="selectCategory(item.name)">
					<text class="dropdown-text">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view v-if="isScrolled && activeTab === 'discover'" class="float-category-btn" @click="showCategoryDropdown = true">
			<image src="/static/images/category.png" class="float-icon" />
			<text class="float-text">{{ activeCategory }}</text>
		</view>

		<view v-show="activeTab === 'discover'" class="discover-content">
			<swiper class="content-swiper" :current="currentCategoryIndex" @change="onContentSwiperChange" :duration="300">
				<swiper-item v-for="(category, catIndex) in categories" :key="catIndex">
					<scroll-view class="content-scroll" scroll-y @scrolltolower="loadMoreContent(catIndex)"
						@scroll="onDiscoverScroll">
						<view class="waterfall">
							<view class="waterfall-column">
								<view v-for="(item, index) in getLeftColumn(catIndex)" :key="index" class="content-card"
									@click="goToContent(item)">
									<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }"
										lazy-load>
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
												<view class="stat-item">
													<image src="/static/images/heart.png" class="stat-icon" mode="aspectFit" />
													<text class="stat-value">{{ item.likes }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="waterfall-column">
								<view v-for="(item, index) in getRightColumn(catIndex)" :key="index" class="content-card"
									@click="goToContent(item)">
									<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }"
										lazy-load>
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
												<view class="stat-item">
													<image src="/static/images/heart.png" class="stat-icon" mode="aspectFit" />
													<text class="stat-value">{{ item.likes }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-if="loadingStates[catIndex]" class="loading-more">
							<text class="loading-text">加载中...</text>
						</view>
						<view v-if="!loadingStates[catIndex] && !hasMore[catIndex]" class="no-more">
							<text class="no-more-text">- 已加载全部 -</text>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<view v-show="activeTab === 'follow'" class="follow-content">
			<scroll-view class="content-scroll" scroll-y @scrolltolower="loadMoreFollowContent" @scroll="onFollowScroll">
				<view class="waterfall">
					<view class="waterfall-column">
						<view v-for="(item, index) in followLeftColumn" :key="index" class="content-card"
							@click="goToContent(item)">
							<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }"
								lazy-load>
							</image>
							<view v-if="item.isVideo" class="video-play-btn">
								<image class="play-icon" src="/static/images/play.png" mode="aspectFit"></image>
							</view>
							<view class="card-content">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-footer">
									<view class="user-info">
										<view class="avatar" :class="{ mutual: item.isMutual }">
											<text class="avatar-text">{{ item.author[0] }}</text>
										</view>
										<text class="author-name">{{ item.author }}</text>
									</view>
									<view class="card-stats">
										<view class="stat-item">
											<image src="/static/images/heart.png" class="stat-icon" mode="aspectFit" />
											<text class="stat-value">{{ item.likes }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="waterfall-column">
						<view v-for="(item, index) in followRightColumn" :key="index" class="content-card"
							@click="goToContent(item)">
							<image class="card-image" :src="item.image" mode="aspectFill" :style="{ height: item.height + 'rpx' }"
								lazy-load>
							</image>
							<view v-if="item.isVideo" class="video-play-btn">
								<image class="play-icon" src="/static/images/play.png" mode="aspectFit"></image>
							</view>
							<view class="card-content">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-footer">
									<view class="user-info">
										<view class="avatar" :class="{ mutual: item.isMutual }">
											<text class="avatar-text">{{ item.author[0] }}</text>
										</view>
										<text class="author-name">{{ item.author }}</text>
									</view>
									<view class="card-stats">
										<view class="stat-item">
											<image src="/static/images/heart.png" class="stat-icon" mode="aspectFit" />
											<text class="stat-value">{{ item.likes }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="followLoading" class="loading-more">
					<text class="loading-text">加载中...</text>
				</view>
				<view v-if="!followLoading && !hasMoreFollow" class="no-more">
					<text class="no-more-text">- 已加载全部 -</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 'discover',
				activeCategory: '推荐',
				currentCategoryIndex: 0,
				showCategoryDropdown: false,
				scrollToCategory: '',
				isScrolled: false,
				categories: [{
						name: '推荐'
					},
					{
						name: '清洁去污'
					},
					{
						name: '厨房技巧'
					},
					{
						name: '衣物护理'
					},
					{
						name: '收纳整理'
					},
					{
						name: '居家保养'
					}
				],
				allCategories: [{
						name: '推荐'
					},
					{
						name: '清洁去污'
					},
					{
						name: '厨房技巧'
					},
					{
						name: '衣物护理'
					},
					{
						name: '收纳整理'
					},
					{
						name: '居家保养'
					},
					{
						name: '宠物照料'
					},
					{
						name: '个人护理'
					},
					{
						name: '出行技巧'
					},
					{
						name: '美食烹饪'
					},
					{
						name: '健康养生'
					},
					{
						name: '数码技巧'
					}
				],
				categoryContent: {},
				loadingStates: {},
				hasMore: {},
				pageNumbers: {},
				followContent: [],
				followLoading: false,
				hasMoreFollow: true,
				followPageNumber: 1,

			}
		},
		onLoad() {
			this.initCategoryData()
			this.initFollowData()
		},
		computed: {
			categoriesLength() {
				return this.categories.length
			},
			followLeftColumn() {
				return this.followContent.filter((_, index) => index % 2 === 0)
			},
			followRightColumn() {
				return this.followContent.filter((_, index) => index % 2 === 1)
			}
		},
		methods: {
			initCategoryData() {
				this.categories.forEach((cat, index) => {
					this.$set(this.categoryContent, cat.name, this.generateMockData(index))
					this.$set(this.loadingStates, cat.name, false)
					this.$set(this.hasMore, cat.name, true)
					this.$set(this.pageNumbers, cat.name, 1)
				})
			},
			initFollowData() {
				this.followContent = [{
						image: 'https://gips0.baidu.com/it/u=872613057,1184940587&fm=3074&app=3074&f=JPEG',
						title: '刚整理的衣柜，分享给大家！',
						author: '整理控悦悦',
						likes: '2.3k',
						height: 520,
						isMutual: true
					},
					{
						image: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
						title: '周末做的美食，简单又好吃',
						author: '美食小美',
						likes: '3.1k',
						height: 460,
						isVideo: true,
						isMutual: true
					},
					{
						image: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638',
						title: '新学到的清洁小技巧',
						author: '居家小能手',
						likes: '1.8k',
						height: 480,
						isMutual: false
					},
					{
						image: 'https://img1.baidu.com/it/u=2579339576,1528213261&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=608',
						title: '阳台改造完成啦！',
						author: '园艺爱好者',
						likes: '4.5k',
						height: 530,
						isMutual: true
					},
					{
						image: 'https://gips1.baidu.com/it/u=3186692341,3473062533&fm=3074&app=3074&f=JPEG',
						title: '今天做了手工收纳盒',
						author: '手作达人',
						likes: '2.9k',
						height: 470,
						isVideo: true,
						isMutual: false
					},
					{
						image: 'https://gips0.baidu.com/it/u=275993497,652383184&fm=3074&app=3074&f=PNG',
						title: '厨房改造分享',
						author: '家居设计师',
						likes: '5.2k',
						height: 510,
						isMutual: true
					}
				]
			},
			loadMoreFollowContent() {
				if (this.followLoading || !this.hasMoreFollow) return

				this.followLoading = true

				setTimeout(() => {
					const pageNum = this.followPageNumber || 1
					const newItems = [{
							image: 'https://gips0.baidu.com/it/u=872613057,1184940587&fm=3074&app=3074&f=JPEG',
							title: `关注动态${pageNum} - 生活小技巧分享`,
							author: '生活达人',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100,
							isVideo: Math.random() > 0.7,
							isMutual: Math.random() > 0.5
						},
						{
							image: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
							title: `关注动态${pageNum} - 居家好物推荐`,
							author: '好物分享',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100,
							isMutual: Math.random() > 0.5
						},
						{
							image: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638',
							title: `关注动态${pageNum} - 收纳技巧`,
							author: '整理师小林',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100,
							isVideo: Math.random() > 0.7,
							isMutual: Math.random() > 0.5
						}
					]

					this.followContent = [...this.followContent, ...newItems]
					this.followPageNumber = pageNum + 1
					this.followLoading = false

					if (this.followPageNumber > 3) {
						this.hasMoreFollow = false
					}
				}, 800)
			},
			generateMockData(categoryIndex) {
				const baseData = [{
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
						title: '卧室收纳妙囊，打造温馨小窝',
						author: '居家设计师',
						likes: '2.5k',
						height: 490,
						isVideo: true
					}
				]
				return baseData.map(item => ({
					...item,
					title: `${this.categories[categoryIndex]?.name || ''} - ${item.title}`
				}))
			},
			getLeftColumn(catIndex) {
				const categoryName = this.categories[catIndex]?.name
				if (!categoryName || !this.categoryContent[categoryName]) return []
				return this.categoryContent[categoryName].filter((_, index) => index % 2 === 0)
			},
			getRightColumn(catIndex) {
				const categoryName = this.categories[catIndex]?.name
				if (!categoryName || !this.categoryContent[categoryName]) return []
				return this.categoryContent[categoryName].filter((_, index) => index % 2 === 1)
			},
			selectCategory(name) {
				this.activeCategory = name
				this.showCategoryDropdown = false
				const index = this.categories.findIndex(cat => cat.name === name)
				if (index !== -1) {
					this.currentCategoryIndex = index
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			onContentSwiperChange(e) {
				const index = e.detail.current
				this.currentCategoryIndex = index
				this.activeCategory = this.categories[index]?.name || '推荐'
				this.scrollToCategory = ''
				setTimeout(() => {
					this.scrollToCategory = 'category-' + this.activeCategory
				}, 100)
			},
			onCategoryScroll() {},
			onDiscoverScroll(e) {
				this.isScrolled = e.detail.scrollTop > 96
			},
			onFollowScroll(e) {
				this.isScrolled = e.detail.scrollTop > 96
			},
			loadMoreContent(catIndex) {
				const categoryName = this.categories[catIndex]?.name
				if (!categoryName || this.loadingStates[categoryName] || !this.hasMore[categoryName]) return

				this.loadingStates[categoryName] = true

				setTimeout(() => {
					const pageNum = this.pageNumbers[categoryName] || 1
					const newItems = [{
							image: 'https://gips0.baidu.com/it/u=872613057,1184940587&fm=3074&app=3074&f=JPEG',
							title: `更多${categoryName}技巧${pageNum}`,
							author: '生活达人',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100,
							isVideo: Math.random() > 0.7
						},
						{
							image: 'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
							title: `实用${categoryName}妙囊${pageNum}`,
							author: '居家能手',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100
						},
						{
							image: 'https://img0.baidu.com/it/u=3411005750,1717082041&fm=253&app=138&f=JPEG?w=500&h=638',
							title: `${categoryName}小窍门${pageNum}`,
							author: '技巧分享',
							likes: `${(Math.random() * 5).toFixed(1)}k`,
							height: 450 + Math.random() * 100,
							isVideo: Math.random() > 0.7
						}
					]

					this.categoryContent[categoryName] = [...this.categoryContent[categoryName], ...newItems]
					this.pageNumbers[categoryName] = pageNum + 1
					this.loadingStates[categoryName] = false

					if (this.pageNumbers[categoryName] > 3) {
						this.hasMore[categoryName] = false
					}
				}, 800)
			},
			goToContent(item) {
				if (!item.isVideo) {
					uni.navigateTo({
						url: '/pages/content/content'
					})
				} else {
					uni.navigateTo({
						url: '/pages/videos/videos'
					})
				}
			}
		}
	}
</script>

<style>
	.page {
		padding-top: var(--status-bar-height);
		background: #1a1a1a;
		padding-bottom: 120rpx;
		height: calc(100vh - var(--status-bar-height) - 120rpx);
		overflow: hidden;
	}

	.header {
		background: #1a1a1a;
		padding: constant(safe-area-inset-top, 24px) 30rpx 20rpx;
		padding: env(safe-area-inset-top, 24px) 30rpx 20rpx;
		border-bottom: 1rpx solid #444;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.tabs {
		display: flex;
		justify-content: center;
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
		width: 36rpx;
		height: 36rpx;
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
		position: sticky;
		top: calc(constant(safe-area-inset-top));
		top: calc(env(safe-area-inset-top));
		z-index: 99;
	}

	.category-scroll {
		white-space: nowrap;
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
		background: rgba(0, 0, 0, 0.95);
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

	.content-swiper {
		width: 100%;
		height: calc(100vh - 180rpx - constant(safe-area-inset-top));
		height: calc(100vh - 180rpx - env(safe-area-inset-top));
	}

	.follow-content {
		width: 100%;
		height: calc(100vh - 90rpx - constant(safe-area-inset-top));
		height: calc(100vh - 90rpx - env(safe-area-inset-top));
	}

	.content-scroll {
		width: 100%;
		height: 100%;
		will-change: scroll-position;
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
	}

	.content {
		padding: 20rpx;
	}

	.waterfall {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
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

	.avatar.mutual {
		position: relative;
	}

	.mutual-tag {
		position: absolute;
		bottom: -8rpx;
		left: 50%;
		transform: translateX(-50%);
		background: #667eea;
		padding: 2rpx 8rpx;
		border-radius: 8rpx;
	}

	.mutual-text {
		font-size: 18rpx;
		color: #fff;
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
		width: 30rpx;
		height: 30rpx;
	}

	.stat-value {
		font-size: 24rpx;
		color: #999;
	}

	.loading-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
	}

	.loading-text {
		font-size: 26rpx;
		color: #666;
	}

	.no-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
	}

	.no-more-text {
		font-size: 24rpx;
		color: #555;
	}
</style>