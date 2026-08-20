// ==========================================
// 1. 全局搜索交互与弹窗逻辑
// ==========================================
function initSearchModal() {
    const globalModal = document.getElementById('globalSearchModal');
    const openGlobalBtn = document.getElementById('openGlobalSearchBtn');
    const closeGlobalBtn = document.getElementById('closeGlobalSearchBtn');
    const globalInput = document.getElementById('globalSearchInput');
    const globalResultsList = document.getElementById('globalSearchResults');
    const db = window.googleDB || [];

    if (globalModal && openGlobalBtn && closeGlobalBtn && globalInput && globalResultsList) {
        const openGlobalSearch = () => {
            globalModal.style.display = 'flex';
            globalInput.value = '';
            globalResultsList.innerHTML = '<li class="res-empty" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 14px;">请输入关键词开始检索...</li>';
            setTimeout(() => globalInput.focus(), 100);
        };

        const closeGlobalSearch = () => { globalModal.style.display = 'none'; };

        openGlobalBtn.addEventListener('click', openGlobalSearch);
        closeGlobalBtn.addEventListener('click', closeGlobalSearch);
        globalModal.addEventListener('click', (e) => { if (e.target === globalModal) closeGlobalSearch(); });

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openGlobalSearch(); }
            if (e.key === 'Escape') closeGlobalSearch();
        });

        globalInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            globalResultsList.innerHTML = '';
            if (query === '') {
                globalResultsList.innerHTML = '<li class="res-empty" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 14px;">请输入关键词开始检索...</li>';
                return;
            }

            const cleanQuery = query.replace(/-/g, '');
            const results = db.filter(item => {
                const targetText = (item.title + " " + item.category + " " + item.keywords).toLowerCase();
                const cleanTarget = targetText.replace(/-/g, '');
                return targetText.includes(query) || cleanTarget.includes(cleanQuery);
            });

            if (results.length > 0) {
                results.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="res-title">${item.title}</span><span class="res-category">${item.category}</span>`;
                    li.addEventListener('click', () => {
                        // 核心：将高亮目标词作为 highlight 参数拼接到网址后面发送出去
                        const targetUrl = item.url + '?highlight=' + encodeURIComponent(item.target);
                        window.open(targetUrl, '_self');
                        closeGlobalSearch();
                    });
                    globalResultsList.appendChild(li);
                });
            } else {
                globalResultsList.innerHTML = `<li class="res-empty" style="padding: 20px; text-align: center; color: #EF4444; font-size: 14px;">未找到与 "${query}" 相关的知识点...</li>`;
            }
        });
    }
}

// ==========================================
// 2. 跨页面接受指令与强制高亮逻辑
// ==========================================
function initHighlight() {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('highlight');
    
    // 如果网址没有带 highlight 参数，说明是正常浏览，直接安静退出，不打扰用户
    if (!keyword) return;

    console.log("🚀 接收到高亮指令，目标寻找词汇:", keyword);

    // 动作 1：先把页面里所有可能隐藏内容的 <details> 树形菜单全部强制打开
    document.querySelectorAll('details').forEach(el => el.setAttribute('open', 'true'));
    
    // 动作 2：延迟 500 毫秒，等页面彻底排版完成，再去找字
    setTimeout(() => {
        // 限定搜索范围：正文区 > 容器区 > 全局
        const searchArea = document.querySelector('main') || document.querySelector('.app-container') || document.body;
        
        // 创建 DOM 文本漫游器，逐字排查
        const walker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT, null, false);
        const forbiddenTags = ['SCRIPT', 'STYLE', 'TITLE', 'INPUT', 'TEXTAREA', 'NOSCRIPT'];
        let found = false;

        const searchStr = keyword.toLowerCase().replace(/-/g, '');
        let node;

        while ((node = walker.nextNode())) {
            const nodeStr = node.nodeValue.toLowerCase().replace(/-/g, '');

            if (nodeStr.includes(searchStr)) {
                const parent = node.parentElement;
                
                // 防御机制：避开弹窗本身和隐藏代码标签
                if (parent && !forbiddenTags.includes(parent.tagName) && !parent.closest('#globalSearchModal')) {
                    console.log("🎯 锁定目标位置，开始高亮闪烁:", parent);
                    
                    // 强制滚动到屏幕居中位置
                    parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 记录它原来的样式，方便一会儿还原
                    const originalBg = parent.style.backgroundColor;
                    const originalBorder = parent.style.border;
                    const originalRadius = parent.style.borderRadius;
                    const originalPadding = parent.style.padding;
                    const originalTransition = parent.style.transition;

                    // 涂上醒目的黄色背景和红色边框
                    parent.style.transition = 'all 0.3s ease';
                    parent.style.backgroundColor = '#FEF08A';
                    parent.style.border = '2px solid #EF4444';
                    parent.style.borderRadius = '4px';
                    parent.style.padding = '2px 4px';
                    parent.style.display = 'inline-block'; // 确保行内文字能完美显示边框
                    
                    // 3.5 秒后擦除高亮，恢复原样
                    setTimeout(() => {
                        parent.style.backgroundColor = originalBg || '';
                        parent.style.border = originalBorder || '';
                        parent.style.borderRadius = originalRadius || '';
                        parent.style.padding = originalPadding || '';
                        setTimeout(() => { parent.style.transition = originalTransition || ''; }, 300);
                    }, 3500);
                    
                    found = true;
                    break; // 找到了就收工，避免页面到处乱跳
                }
            }
        }

        if(!found) {
            console.warn("⚠️ 糟糕，页面里没找到能匹配该词的文本节点:", keyword);
        }
    }, 500); // 增加半秒钟的缓冲，防止由于网络卡顿导致 DOM 树没生成完毕
}

// ==========================================
// 3. 防弹执行中枢：不管页面是秒开还是卡顿，确保函数必定执行
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initSearchModal();
        initHighlight();
    });
} else {
    initSearchModal();
    initHighlight();
}
