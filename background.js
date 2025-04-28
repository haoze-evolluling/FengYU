// 全局变量，用于存储是否使用在线背景图片
let useOnlineBackground = false;
// 全局变量，用于存储预缓存的必应壁纸
let cachedBingImages = [];
// 本地背景图片路径
const localBackgroundPath = 'backgroud01.png';
// 全局变量，用于存储深色模式状态
let darkMode = false;

// 获取必应图片ID的辅助函数
function getBingImageId(idx = 0) {
  // 这里我们使用一些常见的必应壁纸ID
  // 实际上这些ID每天都在变化，这里只是一些示例
  const imageIds = [
    'WinterBison_ZH-CN5219099383',
    'MountainToucan_ZH-CN5774195238',
    'ChineseNewYearEve2023_ZH-CN7188893388',
    'Snowdrops_ZH-CN5805234585',
    'BambooSnow_ZH-CN6941929948',
    'GreatTits_ZH-CN0367320638',
    'SunriseMoai_ZH-CN7413178404'
  ];
  
  // 如果没有提供索引或索引超出范围，则使用随机索引
  if (idx === undefined || idx < 0 || idx >= imageIds.length) {
    idx = Math.floor(Math.random() * imageIds.length);
  }
  
  return imageIds[idx];
}

// 预缓存必应壁纸
function cacheBingImages(count = 3) {
  for (let i = 0; i < count; i++) {
    const imageUrl = `https://www.bing.com/th?id=OHR.${getBingImageId(i)}_1920x1080.jpg&rf=LaDigue_1920x1080.jpg`;
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
      console.log(`预缓存必应壁纸 ${i+1}/${count} 成功`);
      cachedBingImages.push(imageUrl);
    };
    img.onerror = function() {
      console.error(`预缓存必应壁纸 ${i+1}/${count} 失败`);
    };
  }
}

// 从必应壁纸API获取背景图片
function setRandomBackground() {
  // 默认使用本地背景图片
  console.log('使用本地背景图片');
  document.body.style.backgroundImage = `url('${localBackgroundPath}')`;
  
  // 如果不使用在线背景，直接返回
  if (!useOnlineBackground) {
    return;
  }
  
  // 如果选择使用在线背景，尝试使用预缓存的必应壁纸
  if (cachedBingImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * cachedBingImages.length);
    const imageUrl = cachedBingImages[randomIndex];
    
    // 预加载图片
    const img = new Image();
    img.onload = function() {
      // 图片加载完成后设置为背景
      console.log('必应壁纸加载成功，切换到在线背景');
      document.body.style.backgroundImage = `url('${imageUrl}')`;
    };
    img.onerror = function() {
      // 如果加载失败，保持使用本地背景
      console.error('必应壁纸加载失败，保持使用本地背景');
    };
    img.src = imageUrl;
    return;
  }
  
  // 如果没有预缓存的图片，则尝试加载新的必应壁纸
  const idx = Math.floor(Math.random() * 7); // 随机获取最近7天内的一张壁纸
  
  // 构建必应壁纸的直接URL（不需要API调用）
  const imageUrl = `https://www.bing.com/th?id=OHR.${getBingImageId(idx)}_1920x1080.jpg&rf=LaDigue_1920x1080.jpg`;
  
  // 预加载图片
  const img = new Image();
  img.onload = function() {
    // 图片加载完成后设置为背景
    console.log('必应壁纸加载成功，切换到在线背景');
    document.body.style.backgroundImage = `url('${imageUrl}')`;
  };
  img.onerror = function() {
    // 如果加载失败，保持使用本地背景
    console.error('必应壁纸加载失败，保持使用本地背景');
  };
  img.src = imageUrl;
}

// 保存深色模式设置到localStorage
function saveDarkModePreference() {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
  console.log('深色模式设置已保存');
}

// 初始化背景和主题
function initBackgroundAndTheme() {
  // 检查是否使用在线背景
  // 如果localStorage中没有存储useOnlineBackground的值，则初始化为false（默认使用本地背景）
  if (localStorage.getItem('useOnlineBackground') === null) {
    localStorage.setItem('useOnlineBackground', 'false');
  }
  
  // 从localStorage中读取useOnlineBackground的值
  useOnlineBackground = localStorage.getItem('useOnlineBackground') === 'true';
  
  // 预缓存必应壁纸（仅当使用在线背景时）
  if (useOnlineBackground) {
    cacheBingImages(3);
  }
  
  // 设置随机背景图片
  setRandomBackground();
  
  // 读取深色模式设置
  const savedDarkMode = localStorage.getItem('darkMode');
  darkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
  
  // 应用深色模式设置
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('checkbox').checked = true;
    document.getElementById('themeIcon').textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById('checkbox').checked = false;
    document.getElementById('themeIcon').textContent = '🌙';
  }
}

// 设置主题相关的事件监听器
function setupThemeListeners() {
  const checkbox = document.getElementById('checkbox');
  const themeIcon = document.getElementById('themeIcon');
  
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      darkMode = true;
      themeIcon.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      darkMode = false;
      themeIcon.textContent = '🌙';
    }
    saveDarkModePreference();
  });
}

// 导出函数和变量，使其可以在categories.js中使用
window.backgroundModule = {
  initBackgroundAndTheme,
  setupThemeListeners,
  darkMode
};