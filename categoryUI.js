// DOM元素引用
const categoriesContainer = document.getElementById('categoriesContainer');
const settingsBtn = document.getElementById('settingsBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const addWebsiteModal = document.getElementById('addWebsiteModal');
const addCategoryForm = document.getElementById('addCategoryForm');
const addWebsiteForm = document.getElementById('addWebsiteForm');
const contextMenu = document.getElementById('contextMenu');

// 渲染所有分类卡片
function renderCategories(categories) {
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
    <div class="category-actions">
      <button class="edit-title" title="编辑分类名称">✏️</button>
      <button class="delete-btn" title="删除分类">×</button>
    </div>
  `;
  

  
  // 网站列表
  const websiteList = document.createElement('ul');
  websiteList.className = 'website-list';
  
  // 渲染网站列表
  if (category.websites && category.websites.length > 0) {
    category.websites.forEach((website, websiteIndex) => {
      const websiteItem = document.createElement('li');
      websiteItem.className = 'website-item';
      
      // 创建网站链接
      const websiteLink = document.createElement('a');
      websiteLink.href = website.url;
      websiteLink.className = 'website-link';
      websiteLink.target = '_blank';
      
      // 创建网站图标
      const websiteIcon = document.createElement('img');
      const domain = new URL(website.url).hostname;
      // 使用自定义图标或按照优先级获取favicon
      websiteIcon.src = website.icon || `https://${domain}/favicon.ico`;
      websiteIcon.className = 'website-icon';
      websiteIcon.onerror = function() {
        // 多级回退机制
        // 1. 如果直接从网站获取失败，尝试从百度获取
        this.src = `https://favicon.cccyun.cc/${domain}`;
        
        // 2. 如果百度获取失败，尝试从Google获取
        this.onerror = function() {
          this.src = `https://www.google.com/s2/favicons?domain=${domain}`;
          
          // 3. 如果仍然失败，使用本地默认图标
          this.onerror = function() {
            this.src = 'icon.png';
            // 防止继续触发onerror事件
            this.onerror = null;
          };
        };
      };
      
      // 创建网站名称
      const websiteName = document.createElement('span');
      websiteName.className = 'website-name';
      websiteName.textContent = website.name;
      
      // 添加图标和名称到链接
      websiteLink.appendChild(websiteIcon);
      websiteLink.appendChild(websiteName);
      
      // 创建删除按钮
      const deleteBtn = document.createElement('span');
      deleteBtn.className = 'website-delete-btn';
      deleteBtn.innerHTML = '×';
      deleteBtn.title = '删除网站';
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`确定要删除「${website.name}」网站吗？`)) {
          const categories = window.categoryCore.getCategories();
          category.websites.splice(websiteIndex, 1);
          window.categoryCore.saveCategories();
          renderCategories(categories);
        }
      });
      
      // 添加链接和删除按钮到列表项
      websiteItem.appendChild(deleteBtn);
      websiteItem.appendChild(websiteLink);
      
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
  card.appendChild(websiteList);
  card.appendChild(addWebsiteBtn);
  
  // 删除按钮事件（现在在titleDiv内部）
  titleDiv.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`确定要删除「${category.name}」分类吗？`)) {
      const categories = window.categoryCore.getCategories();
      categories.splice(index, 1);
      window.categoryCore.saveCategories();
      renderCategories(categories);
    }
  });
  
  // 编辑分类名称
  titleDiv.querySelector('.edit-title').addEventListener('click', (e) => {
    e.stopPropagation();
    const titleSpan = titleDiv.querySelector('span:first-child');
    const currentName = titleSpan.textContent;
    const newName = prompt('请输入新的分类名称:', currentName);
    
    if (newName && newName.trim() !== '' && newName !== currentName) {
      const categories = window.categoryCore.getCategories();
      categories[index].name = newName.trim();
      window.categoryCore.saveCategories();
      titleSpan.textContent = newName.trim();
    }
  });
  
  return card;
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
  window.categoryCore.setDraggedItem(this, parseInt(this.dataset.index));
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
  
  window.categoryCore.clearDraggedItem();
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
  
  const draggedItem = window.categoryCore.getDraggedItem();
  const draggedItemIndex = window.categoryCore.getDraggedItemIndex();
  
  if (draggedItem !== this) {
    const targetIndex = parseInt(this.dataset.index);
    const categories = window.categoryCore.getCategories();
    
    // 更新数据顺序
    const movedItem = categories.splice(draggedItemIndex, 1)[0];
    categories.splice(targetIndex, 0, movedItem);
    
    // 保存并重新渲染
    window.categoryCore.saveCategories();
    renderCategories(categories);
  }
  
  return false;
}

// 放置到容器中（当没有其他卡片或放在最后位置）
function handleContainerDrop(e) {
  e.preventDefault();
  
  // 只有当不是放在卡片上时才处理
  if (e.target === categoriesContainer) {
    const categories = window.categoryCore.getCategories();
    const draggedItemIndex = window.categoryCore.getDraggedItemIndex();
    
    // 移动到最后
    const movedItem = categories.splice(draggedItemIndex, 1)[0];
    categories.push(movedItem);
    
    // 保存并重新渲染
    window.categoryCore.saveCategories();
    renderCategories(categories);
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

// 设置事件监听器
function setupEventListeners(categories, saveCallback) {

  
  // 设置按钮点击事件 - 显示设置菜单
  settingsBtn.addEventListener('click', () => {
    showModal(document.getElementById('settingsModal'));
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
      saveCallback();
      renderCategories(categories);
      
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
      saveCallback();
      renderCategories(categories);
      
      // 重置表单并关闭模态窗口
      addWebsiteForm.reset();
      hideModal(addWebsiteModal);
    }
  });
  

  
  document.getElementById('addNewCategory').addEventListener('click', () => {
    hideContextMenu();
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

// 导出UI模块功能
window.categoryUI = {
  renderCategories,
  setupEventListeners
};