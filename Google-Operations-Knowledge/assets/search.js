document.addEventListener("DOMContentLoaded", () => {
    // 1. 获取所有必要元素并安全检测
    const globalModal = document.getElementById('globalSearchModal');
    const openGlobalBtn = document.getElementById('openGlobalSearchBtn');
    const closeGlobalBtn = document.getElementById('closeGlobalSearchBtn');
    const globalInput = document.getElementById('globalSearchInput');
    const globalResultsList = document.getElementById('globalSearchResults');
    const db = window.googleDB || [];

    // 2. 绑定交互逻辑（仅在元素存在时执行）
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

    // 3. 跨页面高亮与滚动逻辑
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('highlight');
    
    if (keyword) {
        // 展开所有 detail
        document.querySelectorAll('details').forEach(el => el.setAttribute('open', 'true'));
        
        setTimeout(() => {
            // 优先在主要内容区搜索，如果没有则在 body 搜索
            const searchArea = document.querySelector('main') || document.querySelector('.app-container') || document.body;
            const walker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT, null, false);
            const forbiddenTags = ['SCRIPT', 'STYLE', 'TITLE', 'INPUT', 'TEXTAREA'];
            let node;

            while ((node = walker.nextNode())) {
                const searchStr = keyword.toLowerCase().replace(/-/g, '');
                const nodeStr = node.nodeValue.toLowerCase().replace(/-/g, '');

                if (nodeStr.includes(searchStr)) {
                    const parent = node.parentElement;
                    
                    // 防御：排除非显示标签、弹窗自身
                    if (parent && !forbiddenTags.includes(parent.tagName) && !parent.closest('#globalSearchModal')) {
                        parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        const originalBg = parent.style.backgroundColor;
                        const originalBorder = parent.style.border;
                        const originalRadius = parent.style.borderRadius;
                        const originalPadding = parent.style.padding;
                        const originalTransition = parent.style.transition;

                        parent.style.transition = 'all 0.3s ease';
                        parent.style.backgroundColor = '#FEF08A';
                        parent.style.border = '2px solid #EF4444';
                        parent.style.borderRadius = '4px';
                        parent.style.padding = '2px 4px';
                        
                        setTimeout(() => {
                            parent.style.backgroundColor = originalBg;
                            parent.style.border = originalBorder;
                            parent.style.borderRadius = originalRadius;
                            parent.style.padding = originalPadding;
                            
                            setTimeout(() => {
                                parent.style.transition = originalTransition;
                            }, 300);
                        }, 3500);
                        
                        break;
                    }
                }
            }
        }, 300);
    }
});
