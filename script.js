// 初始化 Masonry 布局
const grid = document.querySelector('.masonry-grid');
const masonry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    gutter: 20
});

// 初始化无限滚动
const infScroll = new InfiniteScroll(grid, {
    path: function() {
        return `api/images?page=${this.pageIndex}&filter=${getCurrentFilter()}`;
    },
    append: '.grid-item',
    status: '.loading-spinner',
    scrollThreshold: 400,
    history: false
});

// 模拟图片数据
const mockImages = [
    { id: 1, title: '山川秀美', url: 'img/image (1).JPG', views: 1200, likes: 234, downloads: 56 },
    { id: 2, title: '城市夜景', url: 'img/image (2).JPG', views: 800, likes: 156, downloads: 32 },
    { id: 3, title: '自然风光', url: 'img/image (3).JPG', views: 2100, likes: 456, downloads: 89 }
];

// 模态框相关
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

// 打开模态框
function openModal(imageData) {
    modal.style.display = 'block';
    modalImage.src = imageData.url;
    document.body.style.overflow = 'hidden';
    updateModalInfo(imageData);
}

// 关闭模态框
function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 更新模态框信息
function updateModalInfo(imageData) {
    const title = modal.querySelector('h2');
    const stats = modal.querySelector('.stats');
    title.textContent = imageData.title;
    // 更新统计信息...
}

// 图片卡片点击事件
document.querySelectorAll('.image-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.image-actions')) {
            const imageId = card.dataset.imageId;
            const imageData = mockImages.find(img => img.id === parseInt(imageId));
            openModal(imageData);
        }
    });
});

// 搜索功能
const searchInput = document.querySelector('.search-container input');
const searchSuggestions = document.querySelector('.search-suggestions');

searchInput.addEventListener('input', debounce(handleSearch, 300));

function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        searchSuggestions.style.display = 'none';
        return;
    }
    // 模拟搜索建议
    fetchSearchSuggestions(query);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 视图切换
const viewButtons = document.querySelectorAll('.view-btn');
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const viewType = btn.dataset.view;
        updateLayoutView(viewType);
    });
});

// 图片操作按钮
document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    if (target.classList.contains('like-btn')) {
        toggleLike(target);
    } else if (target.classList.contains('save-btn')) {
        toggleSave(target);
    } else if (target.classList.contains('download-btn')) {
        handleDownload(target);
    }
});

// 交互功能实现
function toggleLike(button) {
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    // 发送请求更新点赞状态...
}

function toggleSave(button) {
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    // 发送请求更新收藏状态...
}

function handleDownload(button) {
    const imageCard = button.closest('.image-card');
    const imageUrl = imageCard.querySelector('img').src;
    // 处理下载逻辑...
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    masonry.layout();
    
    // 关闭模态框事件
    closeModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
});

// 图片加载完成后重新布局
window.addEventListener('load', () => {
    masonry.layout();
});

// 监听图片加载
document.querySelectorAll('.grid-item img').forEach(img => {
    img.addEventListener('load', () => {
        masonry.layout();
    });
});