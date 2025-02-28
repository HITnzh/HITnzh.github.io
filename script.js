/* 全局重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #f5f5f7;
    color: #1d1d1f;
}

/* 图片轮播容器 */
.carousel {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.carousel-container {
    width: 100%;
    height: 500px; /* 根据需求调整高度 */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* 图片列表 */
.carousel-slide {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 图片适应容器 */
    flex-shrink: 0;
}

/* 图片居中 */
.carousel-slide img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
}

/* 切换按钮 */
.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 24px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.carousel-btn:hover {
    background: rgba(0, 0, 0, 0.8);
}

.prev-btn {
    left: 20px;
}

.next-btn {
    right: 20px;
}

/* 指示器 */
.carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
}

.carousel-indicators .indicator {
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s ease;
}

.carousel-indicators .indicator.active {
    background: rgba(255, 255, 255, 1);
}