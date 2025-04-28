// 全局变量，用于存储是否使用在线背景图片
let useOnlineBackground = false;

// 本地背景图片路径
const localBackgroundPath = 'backgroud01.png';
// 全局变量，用于存储深色模式状态
let darkMode = false;





// 从必应壁纸API获取背景图片
function setRandomBackground() {
  // 默认使用本地背景图片
  console.log('使用本地背景图片');
  document.body.style.backgroundImage = `url('${localBackgroundPath}')`;
  

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