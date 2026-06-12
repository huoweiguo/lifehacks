<template>
	<view class="page">
		<view class="header">
			<view class="back-btn" @click="goBack">
				<image src="/static/images/left.png" class="back-icon" mode="aspectFit" />
			</view>
			<text class="header-title">发布妙囊</text>
			<view class="placeholder"></view>
		</view>

		<view class="content">
			<view class="tabs">
				<view class="tab-item" :class="{ active: activeTab === 'image' }" @click="switchTab(0)">
					<text class="tab-text">图文</text>
					<view v-if="activeTab === 'image'" class="tab-indicator"></view>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'video' }" @click="switchTab(1)">
					<text class="tab-text">视频</text>
					<view v-if="activeTab === 'video'" class="tab-indicator"></view>
				</view>
			</view>

			<swiper class="content-swiper" :current="currentTab" @change="onSwiperChange" :duration="300">
				<swiper-item>
					<view class="swiper-content">
						<view class="upload-section">
							<scroll-view class="upload-scroll" scroll-x :show-scrollbar="true">
								<view class="upload-grid">
									<view v-for="(img, index) in uploadedImages" :key="index" class="upload-item">
										<image :src="img" class="upload-image" mode="aspectFill" @click="previewImage(index)" />
										<view class="remove-btn" @click.stop="removeImage(index)">
											<text class="remove-icon">×</text>
										</view>
									</view>
									<view v-if="uploadedImages.length < 9" class="upload-add" @click="chooseImage">
										<view class="add-icon">
											<text class="add-text">+</text>
										</view>
									</view>
								</view>
							</scroll-view>
							<text class="upload-hint">还可以添加 {{ 9 - uploadedImages.length }} 张图片</text>
						</view>

						<view class="input-section">
							<input class="title-input" placeholder="填写标题" placeholder-class="placeholder-text" v-model="title" />
						</view>

						<view class="category-section">
							<view class="section-header">
								<image src="/static/images/category.png" class="section-icon" mode="aspectFit" />
								<text class="section-title">选择分类</text>
							</view>
							<scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
								<view class="category-list">
									<view v-for="(cat, index) in categories" :key="index" class="category-item"
										:class="{ active: selectedCategory === cat }" @click="selectCategory(cat)">
										<text class="category-text">{{ cat }}</text>
									</view>
								</view>
							</scroll-view>
						</view>

						<view class="input-section">
							<textarea class="content-textarea" placeholder="填写你的妙囊内容..." placeholder-class="placeholder-text"
								v-model="content"></textarea>
						</view>

						<view class="tag-section">
							<view class="section-header">
								<text class="section-title"># 添加标签</text>
							</view>
							<view class="tag-list">
								<view v-for="(tag, index) in tags" :key="index" class="tag-item">
									<text class="tag-text">{{ tag }}</text>
									<view class="tag-remove" @click="removeTag(index)">
										<text class="tag-remove-icon">×</text>
									</view>
								</view>
								<view class="add-tag-btn" @click="showTagModal = true">
									<text class="add-tag-text">+ 添加</text>
								</view>
							</view>
						</view>

						<view class="tips-section">
							<view class="section-header">
								<text class="section-title">妙囊小贴士</text>
								<text class="optional-text">（选填）</text>
							</view>
							<textarea class="tips-textarea" placeholder="请输入小贴士..." placeholder-class="placeholder-text"
								v-model="tips"></textarea>
						</view>
					</view>
				</swiper-item>

				<swiper-item>
					<view class="swiper-content">
						<view class="video-upload-section">
							<view v-if="!videoPath" class="video-upload-area" @click="chooseVideo">
								<view class="video-icon">
									<image src="/static/images/video.png" class="video-icon-image" mode="aspectFill"></image>
								</view>
								<text class="video-upload-text">上传视频</text>
							</view>
							<view v-if="videoPath" class="video-preview">
								<video :src="videoPath" class="video-player" direction="-1" enable-auto-rotation="{{false}}"
									mode="aspectFill" id="myVideo"></video>
								<view class="video-remove" @click="removeVideo">
									<text class="video-remove-icon">×</text>
								</view>
							</view>
						</view>

						<view class="input-section">
							<input class="title-input" placeholder="填写标题" placeholder-class="placeholder-text" v-model="title" />
						</view>

						<view class="category-section">
							<view class="section-header">
								<image src="/static/images/category.png" class="section-icon" mode="aspectFit" />
								<text class="section-title">选择分类</text>
							</view>
							<scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
								<view class="category-list">
									<view v-for="(cat, index) in categories" :key="index" class="category-item"
										:class="{ active: selectedCategory === cat }" @click="selectCategory(cat)">
										<text class="category-text">{{ cat }}</text>
									</view>
								</view>
							</scroll-view>
						</view>

						<view class="tag-section">
							<view class="section-header">
								<text class="section-title"># 添加标签</text>
							</view>
							<view class="tag-list">
								<view v-for="(tag, index) in tags" :key="index" class="tag-item">
									<text class="tag-text">{{ tag }}</text>
									<view class="tag-remove" @click="removeTag(index)">
										<text class="tag-remove-icon">×</text>
									</view>
								</view>
								<view class="add-tag-btn" @click="showTagModal = true">
									<text class="add-tag-text">+ 添加</text>
								</view>
							</view>
						</view>

						<view class="footer video-footer">
							<view class="publish-btn" @click="publish">
								<text class="publish-text">确认发布</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="footer" v-show="activeTab === 'image'">
			<view class="publish-btn" @click="publish">
				<text class="publish-text">确认发布</text>
			</view>
		</view>

		<view v-if="showTagModal" class="modal-overlay" @click="showTagModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">添加标签</text>
					<view class="modal-close" @click="showTagModal = false">
						<text class="close-icon">×</text>
					</view>
				</view>
				<view class="modal-body">
					<input class="modal-input" placeholder="输入标签" placeholder-class="placeholder-text" v-model="newTag"
						@confirm="confirmAddTag" />
				</view>
				<view class="modal-footer">
					<view class="modal-btn cancel" @click="showTagModal = false">
						<text class="btn-text">取消</text>
					</view>
					<view class="modal-btn confirm" @click="confirmAddTag">
						<text class="btn-text">确认</text>
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
			activeTab: 'image',
			currentTab: 0,
			uploadedImages: [
				'https://gips0.baidu.com/it/u=872613057,1184940587&fm=3074&app=3074&f=JPEG',
				'https://img0.baidu.com/it/u=2305867823,4064004191&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
			],
			videoPath: '',
			title: '',
			selectedCategory: '推荐',
			categories: ['清洁', '厨房', '收纳', '卧室', '衣物', '美食', '健康', '数码'],
			content: '',
			tips: '',
			tags: ['厨房技巧', '收纳'],
			newTag: '',
			showTagModal: false
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		switchTab(index) {
			this.currentTab = index
			this.activeTab = index === 0 ? 'image' : 'video'
		},
		onSwiperChange(e) {
			this.currentTab = e.detail.current
			this.activeTab = e.detail.current === 0 ? 'image' : 'video'
		},
		chooseImage() {
			uni.chooseImage({
				count: 9 - this.uploadedImages.length,
				success: (res) => {
					this.uploadedImages = [...this.uploadedImages, ...res.tempFilePaths]
				}
			})
		},
		removeImage(index) {
			this.uploadedImages.splice(index, 1)
		},
		chooseVideo() {
			uni.chooseVideo({
				success: (res) => {
					this.videoPath = res.tempFilePath
				}
			})
		},
		removeVideo() {
			this.videoPath = ''
		},
		previewImage(index) {
			uni.previewImage({
				current: index,
				urls: this.uploadedImages
			})
		},
		selectCategory(cat) {
			this.selectedCategory = cat
		},
		confirmAddTag() {
			if (this.newTag.trim() && !this.tags.includes(this.newTag.trim()) && this.tags.length < 5) {
				this.tags.push(this.newTag.trim())
				this.newTag = ''
				this.showTagModal = false
			} else if (!this.newTag.trim()) {
				uni.showToast({
					title: '请输入标签',
					icon: 'none'
				})
			} else if (this.tags.includes(this.newTag.trim())) {
				uni.showToast({
					title: '标签已存在',
					icon: 'none'
				})
			} else if (this.tags.length >= 5) {
				uni.showToast({
					title: '最多添加5个标签',
					icon: 'none'
				})
			}
		},
		removeTag(index) {
			this.tags.splice(index, 1)
		},
		publish() {
			if (!this.title.trim()) {
				uni.showToast({
					title: '请填写标题',
					icon: 'none'
				})
				return
			}
			if (this.activeTab === 'image') {
				if (!this.content.trim()) {
					uni.showToast({
						title: '请填写内容',
						icon: 'none'
					})
					return
				}
				if (this.uploadedImages.length === 0) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					})
					return
				}
			} else {
				if (!this.videoPath) {
					uni.showToast({
						title: '请上传视频',
						icon: 'none'
					})
					return
				}
			}
			uni.showToast({
				title: '发布成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		}
	}
}
</script>

<style>
.page {
	min-height: 100vh;
	background: #1a1a1a;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: calc(constant(safe-area-inset-top) + 20rpx) 30rpx 20rpx;
	padding: calc(env(safe-area-inset-top) + 20rpx) 30rpx 20rpx;
	background: #1a1a1a;
	border-bottom: 1rpx solid #333;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
}

.header-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #fff;
}

.placeholder {
	width: 60rpx;
}

.content-swiper {
	width: 100%;
	height: calc(100vh - 200rpx);
}

.swiper-content {
	width: 100%;
	min-height: 100%;
	padding: 30rpx 30rpx 0;
	box-sizing: border-box;
}

.tabs {
	display: flex;
	justify-content: center;
	margin-bottom: 30rpx;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #333;
}

.tab-item {
	position: relative;
	padding: 0 60rpx;
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
	bottom: -21rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 6rpx;
	background: #fff;
	border-radius: 3rpx;
}

.upload-section {
	margin-bottom: 30rpx;
}

.upload-scroll {
	white-space: nowrap;
	width: 100%;
}

.upload-grid {
	display: inline-flex;
	gap: 20rpx;
	margin-bottom: 16rpx;
}

.upload-item {
	width: 150rpx;
	height: 150rpx;
	position: relative;
	border-radius: 12rpx;
	overflow: hidden;
	flex-shrink: 0;
}

.upload-image {
	width: 100%;
	height: 100%;
}

.remove-btn {
	position: absolute;
	top: 4rpx;
	right: 4rpx;
	width: 36rpx;
	height: 36rpx;
	background: rgba(0, 0, 0, 0.7);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.remove-icon {
	font-size: 20rpx;
	color: #fff;
	line-height: 1;
}

.upload-add {
	width: 150rpx;
	height: 150rpx;
	border: 2rpx dashed #555;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.add-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-text {
	font-size: 40rpx;
	color: #555;
	line-height: 1;
}

.upload-hint {
	font-size: 24rpx;
	color: #666;
}

.video-upload-section {
	margin-bottom: 30rpx;
}

.video-upload-area {
	width: 100%;
	height: 300rpx;
	border: 2rpx dashed #555;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.video-icon {
	margin-bottom: 16rpx;
}

.video-icon-image {
	width: 80rpx;
	height: 80rpx;
}

.video-upload-text {
	font-size: 28rpx;
	color: #666;
}

.video-preview {
	position: relative;
	width: 100%;
	height: 300rpx;
	border-radius: 12rpx;
	overflow: hidden;
	margin-top: 16rpx;
}

.video-player {
	width: 100%;
	height: 100%;
}

.video-remove {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	width: 48rpx;
	height: 48rpx;
	background: rgba(0, 0, 0, 0.7);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.video-remove-icon {
	font-size: 28rpx;
	color: #fff;
	line-height: 1;
}

.input-section {
	margin-bottom: 30rpx;
}

.title-input {
	width: 100%;
	height: 80rpx;
	background: #2a2a2a;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	color: #fff;
	box-sizing: border-box;
}

.content-textarea {
	width: 100%;
	height: 280rpx;
	background: #2a2a2a;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 30rpx;
	color: #fff;
	box-sizing: border-box;
}

.placeholder-text {
	color: #666;
}

.category-section {
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 12rpx;
}

.section-title {
	font-size: 28rpx;
	color: #999;
}

.category-scroll {
	white-space: nowrap;
}

.category-list {
	display: flex;
	gap: 20rpx;
}

.category-item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 36rpx;
	background: #333;
	height: 60rpx;
	border-radius: 30rpx;
}

.category-item.active {
	background: #fff;
}

.category-item.active .category-text {
	color: #1a1a1a;
}

.category-text {
	font-size: 28rpx;
	color: #fff;
}

.tag-section {
	margin-bottom: 30rpx;
}

.optional-text {
	font-size: 24rpx;
	color: #666;
}

.tips-textarea {
	width: 100%;
	height: 160rpx;
	background: #2a2a2a;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #fff;
	box-sizing: border-box;
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.tag-item {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 0 24rpx;
	background: #333;
	height: 60rpx;
	border-radius: 30rpx;
}

.tag-text {
	font-size: 26rpx;
	color: #fff;
}

.tag-remove {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tag-remove-icon {
	font-size: 24rpx;
	color: #999;
}

.add-tag-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx;
	background: transparent;
	border: 2rpx dashed #555;
	height: 60rpx;
	border-radius: 30rpx;
	box-sizing: border-box;
}

.add-tag-text {
	font-size: 26rpx;
	color: #555;
}

.tag-input-wrap {
	display: flex;
	gap: 16rpx;
	margin-top: 20rpx;
}

.tag-input {
	flex: 1;
	height: 72rpx;
	background: #2a2a2a;
	border-radius: 36rpx;
	padding: 0 28rpx;
	font-size: 28rpx;
	color: #fff;
}

.tag-confirm-btn {
	padding: 0 32rpx;
	height: 72rpx;
	background: #667eea;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tag-confirm-text {
	font-size: 28rpx;
	color: #fff;
}

.modal-overlay {
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

.modal-content {
	width: 80%;
	background: #2a2a2a;
	border-radius: 20rpx;
	overflow: hidden;
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	border-bottom: 1rpx solid #333;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #fff;
}

.modal-close {
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-icon {
	font-size: 40rpx;
	color: #999;
	line-height: 1;
}

.modal-body {
	padding: 30rpx;
}

.modal-input {
	width: 100%;
	height: 80rpx;
	background: #1a1a1a;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	color: #fff;
	box-sizing: border-box;
}

.modal-footer {
	display: flex;
	border-top: 1rpx solid #333;
}

.modal-btn {
	flex: 1;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-btn.cancel {
	border-right: 1rpx solid #333;
}

.modal-btn.cancel .btn-text {
	color: #999;
}

.modal-btn.confirm .btn-text {
	color: #667eea;
	font-weight: bold;
}

.btn-text {
	font-size: 32rpx;
}

.footer {
	padding: 0 40rpx calc(constant(safe-area-inset-bottom) + 40rpx);
	padding: 0 40rpx calc(env(safe-area-inset-bottom) + 40rpx);
	background: #1a1a1a;
}

.video-footer {
	padding-top: 40rpx;
	padding-left: 0;
	padding-right: 0;
}

.publish-btn {
	width: 100%;
	height: 96rpx;
	background: #fff;
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.publish-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #1a1a1a;
}
</style>