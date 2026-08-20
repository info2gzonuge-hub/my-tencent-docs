// ==========================================
// 1. 全自动爬虫引擎：动态抓取全站内容
// ==========================================
// 这里配置你需要让系统自动抓取的网页列表
const urlsToFetch = [
    'index.html', 'tab1.html', 'tab2.html', 'tab3.html', 
    'tab4.html', 'tab5.html', 'tab6.html', 'tab7.html', 
    'tab8.html', 'tab9.html', 'tab10.html'
];

let dynamicDB = [];
let isDbLoaded = false;

async function buildSearchDB() {
    if (isDbLoaded) return;
    
    try {
        console.log("🕷️ 开始在后台抓取全站知识点...");
        // 异步并发去拉取所有 Tab 页面的 HTML 代码
        const fetchPromises = urlsToFetch.map(url => fetch(url).then(res => res.text()).catch(e => ''));
        const htmlTexts = await Promise.all(fetchPromises);
        
        const parser = new DOMParser();
        
        htmlTexts.forEach((html, index) => {
            if (!html) return;
            // 将文本代码转化为可读取的 DOM 树
            const doc = parser.parseFromString(html, 'text/html');
            const pageUrl = urlsToFetch[index];
            
            // 获取页面的主标题作为大分类（兜底使用）
            const panelTitleNode = doc.querySelector('.panel-title');
            const panelTitle = panelTitleNode ? panelTitleNode.textContent.trim() : doc.title;
            const shortCategory = panelTitle.split('·')[0]?.trim() || "知识库";

            // 规则 A：提取所有折叠面板（<details class="tree-item">）中的知识点
            const treeItems = doc.querySelectorAll('.tree-item');
            treeItems.forEach(item => {
                const summary = item.querySelector('summary')?.textContent.replace(/▼/g, '').trim() || '';
                const bodyText = item.querySelector('.tree-body')?.textContent.trim() || '';
                if (summary) {
                    dynamicDB.push({
                        title: summary,
                        category: shortCategory,
                        url: pageUrl,
                        searchText: (summary + " " + bodyText).toLowerCase()
                    });
                }
            });

            // 规则 B：提取所有时间轴卡片（.timeline-card，针对 Tab 1）
            const timelineCards = doc.querySelectorAll('.timeline-card');
            timelineCards.forEach(card => {
                const time = card.querySelector('.time-side')?.textContent.trim() || '';
                const title = card.querySelector('.title')?.textContent.trim() || '';
                const bubble = card.querySelector('.bubble')?.textContent.trim() || '';
                if (title) {
                    dynamicDB.push({
                        title: `${time} ${title}`,
                        category: shortCategory,
                        url: pageUrl,
                        searchText: (time + " " + title + " " + bubble).toLowerCase()
                    });
                }
            });
            
            // 规则 C：如果该页面什么折叠卡片都没有，就把整页文字塞进去
            if (treeItems.length === 0 && timelineCards.length === 0) {
                const mainContent = doc.querySelector('.app-container')?.textContent.trim() || '';
                dynamicDB.push({
                    title: panelTitle,
                    category: shortCategory,
                    url: pageUrl,
                    searchText: mainContent.toLowerCase()
                });
            }
        });
        
        isDbLoaded = true;
        console.log("✅ 全站抓取完毕！自动生成词条数:", dynamicDB.length);
    } catch (error) {
        console.error("❌ 构建自动搜索库失败:", error);
    }
}

// ==========================================
// 2. 全局搜索交互与弹窗逻辑
// ==========================================
function initSearchModal() {
    const globalModal = document.getElementById('globalSearchModal');
    const openGlobalBtn = document.getElementById('openGlobalSearchBtn');
    const closeGlobalBtn = document.getElementById('closeGlobalSearchBtn');
    const globalInput = document.getElementById('globalSearchInput');
    const globalResultsList = document.getElementById('globalSearchResults');

    if (globalModal && openGlobalBtn && closeGlobalBtn && globalInput && globalResultsList) {
        
        // 当用户点击搜索按钮时，触发爬虫抓取
        const openGlobalSearch = async () => {
            globalModal.style.display = 'flex';
            globalInput.value = '';
            
            if (!isDbLoaded) {
                globalResultsList.innerHTML = '<li class="res-empty" style="padding: 20px; text-align: center; color: #2563EB; font-size: 14px;">🔄 首次加载：正在闪电抓取全站数据，请稍候...</li>';
                await buildSearchDB(); // 建立索引
            }
            
            globalResultsList.innerHTML = '<li class="res-empty" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 14px;">请输入关键词开始全文检索...</li>';
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

        // 搜索框输入时的匹配逻辑
        globalInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            globalResultsList.innerHTML = '';
            
            if (query === '') {
                globalResultsList.innerHTML = '<li class="res-empty" style="padding: 20px; text-align: center; color: #94A3B8; font-size: 14px;">请输入关键词开始检索...</li>';
                return;
            }

            if (!isDbLoaded) return; // 防止还没抓取完就搜索

            const cleanQuery = query.replace(/-/g, '');
            const results = dynamicDB.filter(item => {
                const targetText = item.searchText;
                const cleanTarget = targetText.replace(/-/g, '');
                return targetText.includes(query) || cleanTarget.includes(cleanQuery);
            });

            if (results.length > 0) {
                results.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="res-title">${item.title}</span><span class="res-category">${item.category}</span>`;
                    li.addEventListener('click', () => {
                        // 🌟 核心改动：跳转时直接把用户输入的 "query" 传给目标页面的高亮引擎，指哪打哪！
                        const targetUrl = item.url + '?highlight=' + encodeURIComponent(query);
                        window.open(targetUrl, '_self');
                        closeGlobalSearch();
                    });
                    globalResultsList.appendChild(li);
                });
            } else {
                globalResultsList.innerHTML = `<li class="res-empty" style="padding: 20px; text-align: center; color: #EF4444; font-size: 14px;">未找到与 "${query}" 相关的全站知识点...</li>`;
            }
        });
    }
}

// ==========================================
// 3. 跨页面接受指令与强制高亮逻辑
// ==========================================
function initHighlight() {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('highlight');
    if (!keyword) return;

    document.querySelectorAll('details').forEach(el => el.setAttribute('open', 'true'));
    
    setTimeout(() => {
        const searchArea = document.querySelector('main') || document.querySelector('.app-container') || document.body;
        const walker = document.createTreeWalker(searchArea, NodeFilter.SHOW_TEXT, null, false);
        const forbiddenTags = ['SCRIPT', 'STYLE', 'TITLE', 'INPUT', 'TEXTAREA', 'NOSCRIPT'];
        let found = false;

        const searchStr = keyword.toLowerCase().replace(/-/g, '');
        let node;

        while ((node = walker.nextNode())) {
            const nodeStr = node.nodeValue.toLowerCase().replace(/-/g, '');
            if (nodeStr.includes(searchStr)) {
                const parent = node.parentElement;
                
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
                    parent.style.display = 'inline-block';
                    
                    setTimeout(() => {
                        parent.style.backgroundColor = originalBg || '';
                        parent.style.border = originalBorder || '';
                        parent.style.borderRadius = originalRadius || '';
                        parent.style.padding = originalPadding || '';
                        setTimeout(() => { parent.style.transition = originalTransition || ''; }, 300);
                    }, 3500);
                    
                    found = true;
                    break;
                }
            }
        }
    }, 500); 
}

// ==========================================
// 4. 防弹执行中枢
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
