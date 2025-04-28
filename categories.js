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
          { name: "夸克搜索", url: "https://quark.sm.cn", icon: "" }
        ]
      },
      {
        name: "综合电商",
        websites: [
          { name: "淘宝", url: "https://www.taobao.com", icon: "" },
          { name: "京东", url: "https://www.jd.com", icon: "" },
          { name: "天猫", url: "https://www.tmall.com", icon: "" },
          { name: "苏宁易购", url: "https://www.suning.com", icon: "" }
        ]
      },
      {
        name: "社交媒体",
        websites: [
          { name: "微博", url: "https://weibo.com", icon: "" },
          { name: "QQ空间", url: "https://qzone.qq.com", icon: "" },
          { name: "知乎", url: "https://www.zhihu.com", icon: "" },
          { name: "豆瓣", url: "https://www.douban.com", icon: "" }
        ]
      },
      {
        name: "视频平台",
        websites: [
          { name: "抖音", url: "https://www.douyin.com", icon: "" },
          { name: "哔哩哔哩", url: "https://www.bilibili.com", icon: "" },
          { name: "优酷", url: "https://www.youku.com", icon: "" },
          { name: "腾讯视频", url: "https://v.qq.com", icon: "" },
          { name: "爱奇艺", url: "https://www.iqiyi.com", icon: "" }
        ]
      },
      {
        name: "新闻资讯",
        websites: [
          { name: "新浪新闻", url: "https://news.sina.com.cn", icon: "" },
          { name: "腾讯新闻", url: "https://news.qq.com", icon: "" },
          { name: "人民网", url: "http://www.people.com.cn", icon: "" },
          { name: "凤凰新闻", url: "https://news.ifeng.com", icon: "" },
          { name: "新华网", url: "http://www.xinhuanet.com", icon: "" }
        ]
      },
      {
        name: "学习与教育",
        websites: [
          { name: "网易云课堂", url: "https://study.163.com", icon: "" },
          { name: "学堂在线", url: "https://www.xuetangx.com", icon: "" },
          { name: "中国大学MOOC", url: "https://www.icourse163.org", icon: "" },
          { name: "学习通", url: "https://chaoxing.com", icon: "" },
        ]
      },
      {
        name: "开发工具",
        websites: [
          { name: "Github", url: "https://github.com", icon: "" },
          { name: "Vs Code", url: "https://visualstudio.microsoft.com/zh-hans/", icon: "" },
          { name: "IntelliJ IDEA", url: "https://www.jetbrains.com.cn/idea/", icon: "" },
          { name: "Docker", url: "https://www.docker.com/", icon: "" },
        ]
      },
      {
        name: "AI网站",
        websites: [
          { name: "豆包", url: "https://doubao.com", icon: "" },
          { name: "秘塔AI", url: "https://metaso.cn", icon: "" },
          { name: "Kimi Ai", url: "https://kimi.moonshot.cn", icon: "" },
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
  console.log('分类数据已保存');
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