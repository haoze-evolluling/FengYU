// 全局变量
let categories = [];
let draggedItem = null;
let draggedItemIndex = null;

// 从localStorage加载分类数据
function loadCategories() {
  // 尝试从localStorage获取数据
  const savedCategories = localStorage.getItem('categories');
  
  // 解析数据
  categories = savedCategories ? JSON.parse(savedCategories) : [];
  
  // 如果没有分类，添加默认分类和网站
  if (categories.length === 0) {
    categories = [
      {
        name: "搜索引擎",
        websites: [
          { name: "百度", url: "https://www.baidu.com", icon: "" },
          { name: "必应搜索", url: "https://www.bing.com", icon: "" },
          { name: "Google", url: "https://www.google.com", icon: "" },
          { name: "夸克搜索", url: "https://quark.sm.cn", icon: "" },
          { name: "搜狗搜索", url: "https://www.sogou.com", icon: "" }
        ]
      },
      {
        name: "社交媒体",
        websites: [
          { name: "微博", url: "https://weibo.com", icon: "" },
          { name: "知乎", url: "https://www.zhihu.com", icon: "" },
          { name: "小红书", url: "https://www.xiaohongshu.com", icon: "" },
          { name: "豆瓣", url: "https://www.douban.com", icon: "" },
          { name: "哔哩哔哩", url: "https://www.bilibili.com", icon: "" }
        ]
      },
      {
        name: "学习教育",
        websites: [
          { name: "中国大学MOOC", url: "https://www.icourse163.org", icon: "" },
          { name: "网易云课堂", url: "https://study.163.com", icon: "" },
          { name: "慕课网", url: "https://www.imooc.com", icon: "" },
          { name: "学堂在线", url: "https://www.xuetangx.com", icon: "" },
          { name: "Coursera", url: "https://www.coursera.org", icon: "" }
        ]
      },
      {
        name: "工具软件",
        websites: [
          { name: "在线翻译", url: "https://translate.google.com", icon: "" },
          { name: "百度网盘", url: "https://pan.baidu.com", icon: "" },
          { name: "腾讯文档", url: "https://docs.qq.com", icon: "" },
          { name: "石墨文档", url: "https://shimo.im", icon: "" },
          { name: "ProcessOn", url: "https://www.processon.com", icon: "" }
        ]
      }
    ];
    saveCategories();
  }
  
  // 调用UI模块的渲染函数
  window.categoryUI.renderCategories(categories);
}

// 保存分类数据到localStorage
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
  // 初始化背景和主题
  window.backgroundModule.initBackgroundAndTheme();
  
  // 从localStorage加载数据
  loadCategories();
  
  // 设置事件监听器
  window.categoryUI.setupEventListeners(categories, saveCategories);
  
  // 设置主题相关的事件监听器
  window.backgroundModule.setupThemeListeners();
  
  // 设置搜索功能
  setupSearchFunction();
  
  // 设置搜索引擎选择功能
  setupSearchEngineSettings();
});

// 导出核心功能给UI模块使用
window.categoryCore = {
  getCategories: () => categories,
  setDraggedItem: (item, index) => {
    draggedItem = item;
    draggedItemIndex = index;
  },
  getDraggedItem: () => draggedItem,
  getDraggedItemIndex: () => draggedItemIndex,
  clearDraggedItem: () => {
    draggedItem = null;
    draggedItemIndex = null;
  },
  saveCategories: saveCategories
};

// 搜索功能
function setupSearchFunction() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  
  if (!searchForm || !searchInput) return;
  
  // 从localStorage获取保存的搜索引擎
  const savedEngine = localStorage.getItem('searchEngine') || 'https://www.baidu.com/s?wd=';
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    // 获取当前选择的搜索引擎
    const searchEngine = localStorage.getItem('searchEngine') || 'https://www.baidu.com/s?wd=';
    
    // 构建搜索URL并跳转
    const searchUrl = searchEngine + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
    
    // 清空输入框
    searchInput.value = '';
  });
  
  // 支持回车键搜索
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchForm.dispatchEvent(new Event('submit'));
    }
  });
}

// 搜索引擎设置功能
function setupSearchEngineSettings() {
  const searchEngineSelect = document.getElementById('searchEngineSelect');
  if (!searchEngineSelect) return;
  
  // 从localStorage加载保存的搜索引擎
  const savedEngine = localStorage.getItem('searchEngine') || 'https://www.baidu.com/s?wd=';
  
  // 设置下拉框的默认值
  const options = Array.from(searchEngineSelect.options);
  const savedOption = options.find(option => option.value === savedEngine);
  if (savedOption) {
    searchEngineSelect.value = savedEngine;
  } else {
    // 如果保存的引擎不在选项中，默认选择百度
    searchEngineSelect.value = 'https://www.baidu.com/s?wd=';
  }
  
  // 监听搜索引擎选择变化
  searchEngineSelect.addEventListener('change', (e) => {
    const selectedEngine = e.target.value;
    localStorage.setItem('searchEngine', selectedEngine);
    
    // 显示提示
    showToast(`搜索引擎已切换为: ${e.target.options[e.target.selectedIndex].text}`);
  });
}

// 显示提示消息
function showToast(message) {
  // 创建提示元素
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 3秒后移除
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}