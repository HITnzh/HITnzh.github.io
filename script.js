// 获取轮播容器和图片列表
const carouselSlide = document.querySelector('.carousel-slide');
const images = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentIndex = 0;

// 创建指示器
images.forEach((img, index) => {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
    indicatorsContainer.appendChild(indicator);
});

// 更新轮播状态
function updateCarousel() {
    // 计算偏移量
    const offset = -currentIndex * 100;
    carouselSlide.style.transform = `translateX(${offset}%)`;

    // 更新指示器
    updateIndicators();
}

// 更新指示器
function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 切换到上一张图片
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
});

// 切换到下一张图片
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
});

// 自动播放
function autoPlay() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

let autoPlayInterval = setInterval(autoPlay, 3000); // 3秒切换一次

// 鼠标悬停时暂停自动播放
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(autoPlay, 3000);
});