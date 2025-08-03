// 本地背景图片路径
const localBackgroundPath = 'backgroud01.png';
// 全局变量，用于存储深色模式状态
let darkMode = false;

// 设置背景图片
function setRandomBackground() {
  document.body.style.backgroundImage = `url('${localBackgroundPath}')`;
}

// 保存深色模式设置到localStorage
function saveDarkModePreference() {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}

// 初始化背景和主题
function initBackgroundAndTheme() {
  const checkbox = document.getElementById('checkbox');
  const settingsCheckbox = document.getElementById('settingsCheckbox');
  const themeIcon = document.getElementById('themeIcon');
  const settingsThemeIcon = document.getElementById('settingsThemeIcon');
  const body = document.body;
  
  // 设置随机背景图片
  setRandomBackground();
  
  // 读取深色模式设置
  const savedDarkMode = localStorage.getItem('darkMode');
  darkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
  
  // 应用深色模式设置
  body.classList.toggle('dark-mode', darkMode);
  
  // 更新所有主题切换开关的状态
  if (checkbox) checkbox.checked = darkMode;
  if (settingsCheckbox) settingsCheckbox.checked = darkMode;
  if (themeIcon) themeIcon.textContent = darkMode ? '☀️' : '🌙';
  if (settingsThemeIcon) settingsThemeIcon.textContent = darkMode ? '☀️' : '🌙';
}

// 设置主题相关的事件监听器
function setupThemeListeners() {
  const checkbox = document.getElementById('checkbox');
  const settingsCheckbox = document.getElementById('settingsCheckbox');
  const themeIcon = document.getElementById('themeIcon');
  const settingsThemeIcon = document.getElementById('settingsThemeIcon');
  const body = document.body;
  
  function updateTheme(newDarkMode) {
    darkMode = newDarkMode;
    body.classList.toggle('dark-mode', darkMode);
    
    // 同步更新所有主题切换开关和图标
    if (checkbox) checkbox.checked = darkMode;
    if (settingsCheckbox) settingsCheckbox.checked = darkMode;
    if (themeIcon) themeIcon.textContent = darkMode ? '☀️' : '🌙';
    if (settingsThemeIcon) settingsThemeIcon.textContent = darkMode ? '☀️' : '🌙';
    
    saveDarkModePreference();
  }
  
  // 为主题切换开关添加事件监听器
  if (checkbox) {
    checkbox.addEventListener('change', function() {
      updateTheme(this.checked);
    });
  }
  
  if (settingsCheckbox) {
    settingsCheckbox.addEventListener('change', function() {
      updateTheme(this.checked);
    });
  }
}

// 导出函数和变量，使其可以在categories.js中使用
window.backgroundModule = {
  initBackgroundAndTheme,
  setupThemeListeners,
  darkMode
};