// 图片数据
const imageData = [
    {
        id: 1,
        title: "山水风光",
        url: "img/image (1).JPG",
        author: "摄影师A",
        category: "nature",
        tags: ["自然", "风景", "山水"],
        views: 1256,
        likes: 234,
        downloads: 56
    },
    {
        id: 2,
        title: "城市夜景",
        url: "img/image (2).JPG",
        author: "摄影师B",
        category: "urban",
        tags: ["城市", "夜景", "建筑"],
        views: 856,
        likes: 142,
        downloads: 32
    },
    {
        id: 3,
        title: "抽象艺术",
        url: "img/image (3).JPG",
        author: "艺术家C",
        category: "abstract",
        tags: ["抽象", "艺术", "创意"],
        views: 2100,
        likes: 456,
        downloads: 89
    },
    // 可以根据需要添加更多图片数据
];

// DOM元素
const imageGrid = document.getElementById('imageGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadingSpinner = document.querySelector('.loading-spinner');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const uploadModal = document.getElementById('uploadModal');
const uploadBtn = document.querySelector('.upload-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');
const filterSelect = document.querySelector('.filter-select');
const categorySelect = document.querySelector('.category-select');
const viewBtns = document.querySelectorAll('.view-btn');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// 当前页码和每页显示数量
let currentPage = 1;
const itemsPerPage = 6;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载初始图片
    loadImages();
    
    // 初始化事件监听器
    initEventListeners();
});

// 加载图片
function loadImages(page = 1) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentImages = imageData.slice(start, end);
    
    if (currentImages.length === 0) {
        loadMoreBtn.textContent = '没有更多图片了';
        loadMoreBtn.disabled = true;
        return;
    }
    
    // 显示加载动画
    loadingSpinner.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    
    // 模拟网络延迟
    setTimeout(() => {
        // 创建图片卡片
        currentImages.forEach(image => {
            const card = createImageCard(image);
            imageGrid.appendChild(card);
        });
        
        // 初始化瀑布流布局
        initMasonry();
        
        // 隐藏加载动画
        loadingSpinner.style.display = 'none';
        loadMoreBtn.style.display = 'block';
        
        // 更新当前页码
        currentPage = page;
    }, 800);
}

// 创建图片卡片
function createImageCard(image) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.dataset.category = image.category;
    
    gridItem.innerHTML = `
        <div class="image-card">
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="image-overlay">
                <div class="image-info">
                    <h3>${image.title}</h3>
                    <div class="stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(image.views)}</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(image.likes)}</span>
                        <span><i class="fas fa-download"></i> ${formatNumber(image.downloads)}</span>
                    </div>
                </div>
                <div class="image-actions">
                    <button class="like-btn" data-id="${image.id}"><i class="far fa-heart"></i></button>
                    <button class="save-btn" data-id="${image.id}"><i class="far fa-bookmark"></i></button>
                    <button class="download-btn" data-id="${image.id}"><i class="fas fa-download"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // 添加点击事件，打开模态框
    gridItem.querySelector('.image-card').addEventListener('click', (e) => {
        if (!e.target.closest('.image-actions')) {
            openImageModal(image);
        }
    });
    
    return gridItem;
}

// 格式化数字
function formatNumber(num) {
    return num >= 1000 ? (num/1000).toFixed(1) + 'k' : num;
}

// 初始化瀑布流布局
function initMasonry() {
    imagesLoaded(imageGrid, function() {
        const masonry = new Masonry(imageGrid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: 20
        });
    });
}

// 打开图片模态框
function openImageModal(image) {
    modalImage.src = image.url;
    modal.querySelector('h2').textContent = image.title;
    modal.querySelector('.author a').textContent = image.author;
    
    // 设置标签
    const tagsContainer = modal.querySelector('.tags');
    tagsContainer.innerHTML = '';
    image.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = `#${tag}`;
        tagsContainer.appendChild(span);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 初始化事件监听器
function initEventListeners() {
    // 加载更多按钮
    loadMoreBtn.addEventListener('click', () => {
        loadImages(currentPage + 1);
    });
    
    // 关闭模态框
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            uploadModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // 上传按钮
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // 筛选器
    categorySelect.addEventListener('change', filterImages);
    filterSelect.addEventListener('change', sortImages);
    
    // 视图切换
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const viewType = btn.dataset.view;
            if (viewType === 'grid') {
                imageGrid.classList.remove('masonry-view');
                imageGrid.classList.add('grid-view');
            } else {
                imageGrid.classList.remove('grid-view');
                imageGrid.classList.add('masonry-view');
            }
