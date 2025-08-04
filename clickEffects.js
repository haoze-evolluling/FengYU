// 点击效果管理器
class ClickEffectManager {
  constructor() {
    this.init();
  }

  init() {
    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEffects());
    } else {
      this.setupEffects();
    }

    // 监听动态添加的元素
    this.setupMutationObserver();
  }

  setupEffects() {
    // 为按钮添加点击效果
    this.addClickEffect('.btn', 'btn');
    this.addClickEffect('.search-btn', 'search-btn');
    this.addClickEffect('.settings-btn', 'settings-btn');
    this.addClickEffect('.close-btn', 'close-btn');

    // 为卡片添加点击效果（不包括category-card，取消div的点击反馈）
    this.addClickEffect('.website-card', 'website-card');
    
    // 为网站列表项添加点击反馈
    this.addClickEffect('.website-item', 'website-item');

    // 为主题切换开关添加点击效果
    this.addClickEffect('.theme-switch', 'theme-switch');

    // 为上下文菜单项添加点击效果
    this.addClickEffect('.context-menu li', 'context-menu-item');



    // 为模态窗口中的按钮添加点击效果
    this.addClickEffect('.modal .btn', 'modal-btn');
  }

  addClickEffect(selector, effectType = 'click-effect') {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!element.classList.contains('click-effect')) {
        element.classList.add('click-effect');
        
        // 添加额外的类型特定类
        if (effectType !== 'click-effect') {
          element.classList.add(effectType);
        }
      }
    });
  }

  setupMutationObserver() {
    // 创建MutationObserver来监听DOM变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              this.processNewElement(node);
            }
          });
        }
      });
    });

    // 开始监听整个文档
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processNewElement(element) {
    // 处理新添加的元素
    try {
      // 确保element是有效的DOM元素
      if (!element || element.nodeType !== 1) return;

      // 为新添加的按钮添加效果
      const buttons = element.querySelectorAll ? element.querySelectorAll('.btn, .search-btn, .settings-btn, .close-btn') : [];
      buttons.forEach(btn => this.addClickEffect(btn, 'btn'));

      // 为新添加的卡片添加效果（不包括category-card）
      const cards = element.querySelectorAll ? element.querySelectorAll('.website-card') : [];
      cards.forEach(card => this.addClickEffect(card, 'card'));
      
      // 为新添加的网站列表项添加效果
      const websiteItems = element.querySelectorAll ? element.querySelectorAll('.website-item') : [];
      websiteItems.forEach(item => this.addClickEffect(item, 'website-item'));

      // 为新添加的上下文菜单项添加效果
      const menuItems = element.querySelectorAll ? element.querySelectorAll('.context-menu li') : [];
      menuItems.forEach(item => this.addClickEffect(item, 'context-menu-item'));

      // 如果元素本身是需要添加效果的类型
        if (element.matches) {
          if (element.matches('.btn, .search-btn, .settings-btn, .close-btn')) {
            this.addClickEffect(element, 'btn');
          } else if (element.matches('.website-card')) {
            this.addClickEffect(element, 'card');
          } else if (element.matches('.website-item')) {
            this.addClickEffect(element, 'website-item');
          } else if (element.matches('.context-menu li')) {
            this.addClickEffect(element, 'context-menu-item');
          } else if (element.matches('.theme-switch')) {
            this.addClickEffect(element, 'theme-switch');
          }
        }
    } catch (error) {
      console.warn('Error processing new element for click effects:', error);
    }
  }

  // 手动为特定元素添加点击效果
  addEffectToElement(element, effectType = 'click-effect') {
    if (element && !element.classList.contains('click-effect')) {
      element.classList.add('click-effect');
      if (effectType !== 'click-effect') {
        element.classList.add(effectType);
      }
    }
  }

  // 移除元素的点击效果
  removeEffectFromElement(element) {
    if (element) {
      element.classList.remove('click-effect', 'btn', 'search-btn', 'settings-btn', 'close-btn', 'category-card', 'website-card', 'theme-switch', 'context-menu-item', 'modal-btn');
    }
  }
}

// 创建全局实例
window.clickEffectManager = new ClickEffectManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClickEffectManager;
}