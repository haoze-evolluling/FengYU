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
  const checkbox = document.getElementById('checkbox');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;
  
  // 设置随机背景图片
  setRandomBackground();
  
  // 读取深色模式设置
  const savedDarkMode = localStorage.getItem('darkMode');
  darkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
  
  // 应用深色模式设置
  body.classList.toggle('dark-mode', darkMode);
  checkbox.checked = darkMode;
  themeIcon.textContent = darkMode ? '☀️' : '🌙';
}

// 设置主题相关的事件监听器
function setupThemeListeners() {
  const checkbox = document.getElementById('checkbox');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;
  
  checkbox.addEventListener('change', function() {
    darkMode = this.checked;
    body.classList.toggle('dark-mode', darkMode);
    themeIcon.textContent = darkMode ? '☀️' : '🌙';
    saveDarkModePreference();
  });
}

// 导出函数和变量，使其可以在categories.js中使用
window.backgroundModule = {
  initBackgroundAndTheme,
  setupThemeListeners,
  darkMode
};