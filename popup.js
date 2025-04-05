// 全局变量
let categories = [];
let draggedItem = null;
let draggedItemIndex = null;
let darkMode = false;

// DOM元素引用
const categoriesContainer = document.getElementById('categoriesContainer');
const settingsBtn = document.getElementById('settingsBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const addWebsiteModal = document.getElementById('addWebsiteModal');
const addCategoryForm = document.getElementById('addCategoryForm');
const addWebsiteForm = document.getElementById('addWebsiteForm');
const contextMenu = document.getElementById('contextMenu');

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
  // 从存储中加载数据
  loadCategories();
  
  // 设置事件监听器
  setupEventListeners();
  
  // 初始化系统时间显示
  initSystemTime();
});

// 从Chrome存储加载分类数据和主题设置
function loadCategories() {
  chrome.storage.sync.get(['categories', 'darkMode'], (data) => {
    categories = data.categories || [];
    darkMode = data.darkMode || false;
    
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
    
    // 如果没有分类，添加默认分类和网站
    if (categories.length === 0) {
      categories = [
        {
          name: "学习资源",
          websites: [
            { name: "百度文库", url: "https://wenku.baidu.com", icon: "" },
            { name: "中国大学MOOC", url: "https://www.icourse163.org", icon: "" },
            { name: "知网", url: "https://www.cnki.net", icon: "" },
            { name: "学堂在线", url: "https://www.xuetangx.com", icon: "" },
            { name: "菜鸟教程", url: "https://www.runoob.com", icon: "" }
          ]
        },
        {
          name: "新闻媒体",
          websites: [
            { name: "人民网", url: "http://www.people.com.cn", icon: "" },
            { name: "新华网", url: "http://www.xinhuanet.com", icon: "" },
            { name: "央视网", url: "https://www.cctv.com", icon: "" },
            { name: "澎湃新闻", url: "https://www.thepaper.cn", icon: "" },
            { name: "腾讯新闻", url: "https://news.qq.com", icon: "" }
          ]
        },
        {
          name: "购物",
          websites: [
            { name: "淘宝", url: "https://www.taobao.com", icon: "" },
            { name: "京东", url: "https://www.jd.com", icon: "" },
            { name: "拼多多", url: "https://www.pinduoduo.com", icon: "" },
            { name: "苏宁易购", url: "https://www.suning.com", icon: "" },
            { name: "唯品会", url: "https://www.vip.com", icon: "" }
          ]
        },
        {
          name: "社交媒体",
          websites: [
            { name: "微博", url: "https://weibo.com", icon: "" },
            { name: "知乎", url: "https://www.zhihu.com", icon: "" },
            { name: "豆瓣", url: "https://www.douban.com", icon: "" },
            { name: "B站", url: "https://www.bilibili.com", icon: "" },
            { name: "小红书", url: "https://www.xiaohongshu.com", icon: "" }
          ]
        },
        {
          name: "工具",
          websites: [
            { name: "百度翻译", url: "https://fanyi.baidu.com", icon: "" },
            { name: "高德地图", url: "https://www.amap.com", icon: "" },
            { name: "百度网盘", url: "https://pan.baidu.com", icon: "" },
            { name: "有道词典", url: "https://dict.youdao.com", icon: "" },
            { name: "天气预报", url: "http://www.weather.com.cn", icon: "" }
          ]
        }
      ];
      saveCategories();
    }
    
    renderCategories();
  });
}

// 保存分类数据到Chrome存储
function saveCategories() {
  chrome.storage.sync.set({ categories: categories }, () => {
    console.log('分类数据已保存');
  });
}

// 保存深色模式设置
function saveDarkModePreference() {
  chrome.storage.sync.set({ darkMode: darkMode }, () => {
    console.log('深色模式设置已保存');
  });
}

// 渲染所有分类卡片
function renderCategories() {
  categoriesContainer.innerHTML = '';
  
  if (categories.length === 0) {
    // 如果没有分类，显示欢迎信息
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
      <h2>欢迎使用凤羽 (FengYU)!</h2>
      <p>右击此处添加您的第一个分类</p>
    `;
    categoriesContainer.appendChild(welcomeDiv);
    return;
  }
  
  // 渲染每个分类卡片
  categories.forEach((category, index) => {
    const categoryCard = createCategoryCard(category, index);
    categoriesContainer.appendChild(categoryCard);
  });
  
  // 设置拖拽功能
  setupDragDrop();
}

// 创建分类卡片元素
function createCategoryCard(category, index) {
  const card = document.createElement('div');
  card.className = 'category-card';
  card.draggable = true;
  card.dataset.index = index;
  
  // 分类标题
  const titleDiv = document.createElement('div');
  titleDiv.className = 'category-title';
  titleDiv.innerHTML = `
    <span>${category.name}</span>
    <span class="edit-title" title="编辑分类名称">✏️</span>
  `;
  
  // 删除按钮
  const deleteBtn = document.createElement('div');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '×';
  deleteBtn.title = '删除分类';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`确定要删除「${category.name}」分类吗？`)) {
      categories.splice(index, 1);
      saveCategories();
      renderCategories();
    }
  });
  
  // 网站列表
  const websiteList = document.createElement('ul');
  websiteList.className = 'website-list';
  
  // 渲染网站列表
  if (category.websites && category.websites.length > 0) {
    category.websites.forEach((website, websiteIndex) => {
      const websiteItem = document.createElement('li');
      websiteItem.className = 'website-item';
      
      websiteItem.innerHTML = `
        <a href="${website.url}" class="website-link" target="_blank">
          <img src="${website.icon || 'https://www.google.com/s2/favicons?domain=' + new URL(website.url).hostname}" 
               class="website-icon" 
               onerror="this.src='https://www.google.com/s2/favicons?domain=example.com'">
          <span class="website-name">${website.name}</span>
        </a>
      `;
      
      websiteList.appendChild(websiteItem);
    });
  }
  
  // 添加网站按钮
  const addWebsiteBtn = document.createElement('div');
  addWebsiteBtn.className = 'add-website-btn';
  addWebsiteBtn.innerHTML = '+ 添加网站';
  addWebsiteBtn.addEventListener('click', () => {
    document.getElementById('categoryId').value = index;
    document.getElementById('websiteName').value = '';
    document.getElementById('websiteUrl').value = '';
    document.getElementById('websiteIcon').value = '';
    showModal(addWebsiteModal);
  });
  
  // 组装卡片
  card.appendChild(titleDiv);
  card.appendChild(deleteBtn);
  card.appendChild(websiteList);
  card.appendChild(addWebsiteBtn);
  
  // 编辑分类名称
  titleDiv.querySelector('.edit-title').addEventListener('click', (e) => {
    e.stopPropagation();
    const titleSpan = titleDiv.querySelector('span:first-child');
    const currentName = titleSpan.textContent;
    const newName = prompt('请输入新的分类名称:', currentName);
    
    if (newName && newName.trim() !== '' && newName !== currentName) {
      categories[index].name = newName.trim();
      saveCategories();
      titleSpan.textContent = newName.trim();
    }
  });
  
  return card;
}

// 初始化系统时间显示
function initSystemTime() {
  const systemTimeElement = document.getElementById('systemTime');
  
  // 更新时间的函数
  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    systemTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  // 立即更新一次时间
  updateTime();
  
  // 每秒更新一次时间
  setInterval(updateTime, 1000);
}

// 设置拖拽排序功能
function setupDragDrop() {
  const cards = document.querySelectorAll('.category-card');
  
  cards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('dragenter', handleDragEnter);
    card.addEventListener('dragleave', handleDragLeave);
    card.addEventListener('drop', handleDrop);
  });
  
  // 容器也需要处理拖拽事件
  categoriesContainer.addEventListener('dragover', handleDragOver);
  categoriesContainer.addEventListener('drop', handleContainerDrop);
}

// 拖拽开始
function handleDragStart(e) {
  draggedItem = this;
  draggedItemIndex = parseInt(this.dataset.index);
  this.classList.add('dragging');
  
  // 设置拖拽数据
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

// 拖拽结束
function handleDragEnd() {
  this.classList.remove('dragging');
  
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    card.classList.remove('drag-over');
  });
  
  draggedItem = null;
  draggedItemIndex = null;
}

// 拖拽经过元素时
function handleDragOver(e) {
  e.preventDefault();
  return false;
}

// 拖拽进入元素
function handleDragEnter(e) {
  this.classList.add('drag-over');
}

// 拖拽离开元素
function handleDragLeave() {
  this.classList.remove('drag-over');
}

// 放置到另一个卡片上
function handleDrop(e) {
  e.stopPropagation();
  
  if (draggedItem !== this) {
    const targetIndex = parseInt(this.dataset.index);
    
    // 更新数据顺序
    const movedItem = categories.splice(draggedItemIndex, 1)[0];
    categories.splice(targetIndex, 0, movedItem);
    
    // 保存并重新渲染
    saveCategories();
    renderCategories();
  }
  
  return false;
}

// 放置到容器中（当没有其他卡片或放在最后位置）
function handleContainerDrop(e) {
  e.preventDefault();
  
  // 只有当不是放在卡片上时才处理
  if (e.target === categoriesContainer) {
    // 移动到最后
    const movedItem = categories.splice(draggedItemIndex, 1)[0];
    categories.push(movedItem);
    
    // 保存并重新渲染
    saveCategories();
    renderCategories();
  }
  
  return false;
}

// 显示模态窗口
function showModal(modal) {
  modal.classList.add('show');
}

// 隐藏模态窗口
function hideModal(modal) {
  modal.classList.remove('show');
}

// 设置事件监听器
function setupEventListeners() {
  // 深色模式切换
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
  
  // 设置按钮点击事件
  settingsBtn.addEventListener('click', () => {
    showContextMenu(event);
  });
  
  // 关闭模态窗口按钮
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      hideModal(btn.closest('.modal'));
    });
  });
  
  // 添加分类表单提交
  addCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value.trim();
    
    if (categoryName) {
      // 添加新分类
      categories.push({
        name: categoryName,
        websites: []
      });
      
      // 保存并重新渲染
      saveCategories();
      renderCategories();
      
      // 重置表单并关闭模态窗口
      addCategoryForm.reset();
      hideModal(addCategoryModal);
    }
  });
  
  // 添加网站表单提交
  addWebsiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categoryId = document.getElementById('categoryId').value;
    const websiteName = document.getElementById('websiteName').value.trim();
    const websiteUrl = document.getElementById('websiteUrl').value.trim();
    const websiteIcon = document.getElementById('websiteIcon').value.trim();
    
    // 验证URL格式
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      alert('网站地址必须以http://或https://开头');
      return;
    }
    
    if (websiteName && websiteUrl) {
      // 添加新网站
      if (!categories[categoryId].websites) {
        categories[categoryId].websites = [];
      }
      
      categories[categoryId].websites.push({
        name: websiteName,
        url: websiteUrl,
        icon: websiteIcon || ''
      });
      
      // 保存并重新渲染
      saveCategories();
      renderCategories();
      
      // 重置表单并关闭模态窗口
      addWebsiteForm.reset();
      hideModal(addWebsiteModal);
    }
  });
  
  // 右键菜单项点击事件
  document.getElementById('editCategory').addEventListener('click', () => {
    hideContextMenu();
    // 当前未实现编辑分类逻辑，因为需要知道点击的是哪个分类
    alert('请直接点击分类卡片上的编辑图标来编辑分类');
  });
  
  document.getElementById('deleteCategory').addEventListener('click', () => {
    hideContextMenu();
    // 当前未实现删除分类逻辑，因为需要知道点击的是哪个分类
    alert('请直接点击分类卡片上的删除按钮来删除分类');
  });
  
  document.getElementById('addNewCategory').addEventListener('click', () => {
    hideContextMenu();
    document.getElementById('categoryName').value = '';
    showModal(addCategoryModal);
  });
  
  // 确保添加分类模态窗口正常显示
  document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('categoryName').value = '';
    showModal(addCategoryModal);
  });

  
  // 点击页面其他地方关闭右键菜单
  document.addEventListener('click', () => {
    hideContextMenu();
  });
  
  // 右键菜单
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // 只有在分类容器区域右击时才显示菜单
    if (e.target.closest('#categoriesContainer')) {
      showContextMenu(e);
    }
  });
}

// 显示右键菜单
function showContextMenu(e) {
  const menu = document.getElementById('contextMenu');
  menu.style.display = 'block';
  
  // 调整菜单位置
  const x = e.clientX;
  const y = e.clientY;
  
  // 确保菜单不会超出视口
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  if (x + menuWidth > windowWidth) {
    menu.style.left = (windowWidth - menuWidth) + 'px';
  } else {
    menu.style.left = x + 'px';
  }
  
  if (y + menuHeight > windowHeight) {
    menu.style.top = (windowHeight - menuHeight) + 'px';
  } else {
    menu.style.top = y + 'px';
  }
}

// 隐藏右键菜单
function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}