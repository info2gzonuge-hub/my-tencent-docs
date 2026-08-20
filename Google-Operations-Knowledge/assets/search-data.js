const googleDB = [
    // ================= Tab 1：算法更新 =================
    { title: "INP 替代 FID", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2024.03 inp 替代 fid 交互顺滑", target: "INP" },
    { title: "打击链接网络 & AI客座文章农场", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2024.12 链接网络 ai客座文章 外链", target: "链接网络" },
    { title: "核心更新：E-E-A-T 权重提升", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2025.03 e-e-a-t eeat 权重 真实的人", target: "E-E-A-T" },
    { title: "打击寄生虫 SEO", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2025.08 寄生虫 seo 大品牌域名", target: "寄生虫" },
    { title: "质量胜于数量", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2025.12 质量胜于数量 真实经验", target: "质量胜于数量" },
    { title: "Discover 独立更新", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2026.02 discover 信息流推荐", target: "Discover" },
    { title: "硬性信号：信息增益", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2026.03 信息增益 information gain", target: "信息增益" },
    { title: "Preferred Sources 首选来源", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2026.04 preferred sources 首选来源", target: "Preferred Sources" },
    { title: "搜索界面革命", category: "Tab 1 - 算法更新", url: "tab1.html", keywords: "2026.07 搜索界面革命 ai生成答案", target: "界面革命" },

    // ================= Tab 2：底层思维 =================
    { title: "搜索引擎工作原理", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "抓取 crawling 索引 indexing 排名 ranking", target: "工作原理" },
    { title: "核心算法与排名系统", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "bert rankbrain 神经匹配 passage ranking", target: "RankBrain" },
    { title: "SEO vs SIO vs GEO", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "seo sio geo 搜索意图 生成式引擎 引用率", target: "GEO" },
    { title: "E-E-A-T 质量框架", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "e-e-a-t 经验 experience 专业 权威 可信", target: "E-E-A-T" },
    { title: "PR值 (PageRank) 传递逻辑", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "pr值 pagerank 权重传递 良好外链属性", target: "PR值" },
    { title: "GEO 被AI引用对策", category: "Tab 2 - 底层思维", url: "tab2.html", keywords: "被ai引用 geo对策 结构化 前100字回答", target: "被AI引用" },

    // ================= Tab 3：独立站基建 =================
    { title: "域名购买", category: "Tab 3 - 独立站基建", url: "tab3.html", keywords: "域名 namesilo 阿里云", target: "Namesilo" },
    { title: "服务器与主机", category: "Tab 3 - 独立站基建", url: "tab3.html", keywords: "服务器 siteground hostinger", target: "SiteGround" },
    { title: "环境配置 (SSL/CDN/备份)", category: "Tab 3 - 独立站基建", url: "tab3.html", keywords: "ssl https cdn cloudflare 网站备份", target: "SSL" },
    { title: "WordPress与主题安装", category: "Tab 3 - 独立站基建", url: "tab3.html", keywords: "wordpress elementor pro hello主题", target: "Elementor" },

    // ================= Tab 4：站内SEO =================
    { title: "关键词研究", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "关键词 ai overviews挖掘 字母汤 采购词", target: "关键词研究" },
    { title: "Atomic Answer 框架", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "atomic answer 原子答案 精简答案", target: "Atomic Answer" },
    { title: "信息增益五支柱", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "信息增益 专有数据 反向专家 内容防腐", target: "信息增益" },
    { title: "实体化内容", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "实体化内容 entity 知识图谱", target: "实体化内容" },
    { title: "页面元素标配", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "tkd 标签 url别名 图片alt webp 内部链接", target: "TKD" },
    { title: "结构化数据 (Schema)", category: "Tab 4 - 站内SEO", url: "tab4.html", keywords: "结构化数据 schema article faq product 实体密度", target: "结构化数据" },

    // ================= Tab 5：技术SEO =================
    { title: "XML与HTML站点地图", category: "Tab 5 - 技术SEO", url: "tab5.html", keywords: "xml html sitemap 站点地图", target: "站点地图" },
    { title: "Robots 与 Canonical", category: "Tab 5 - 技术SEO", url: "tab5.html", keywords: "robots canonical noindex 规范化", target: "Robots" },
    { title: "孤岛页面与重复内容", category: "Tab 5 - 技术SEO", url: "tab5.html", keywords: "孤岛页面 重复内容 nofollow", target: "孤岛页面" },
    { title: "重定向与核心网页指标", category: "Tab 5 - 技术SEO", url: "tab5.html", keywords: "301 302 404 重定向 core web vitals inp lcp", target: "重定向" },

    // ================= Tab 6：站外影响力 =================
    { title: "外链建设方法", category: "Tab 6 - 站外影响力", url: "tab6.html", keywords: "外链建设 客座文章 摩天楼 apl 失效链接", target: "外链建设" },
    { title: "无效/危险的外链", category: "Tab 6 - 站外影响力", url: "tab6.html", keywords: "危险外链 链接网络 pbn 目录提交", target: "危险的外链" },
    { title: "品牌提及 (Brand Mentions)", category: "Tab 6 - 站外影响力", url: "tab6.html", keywords: "品牌提及 brand mentions reddit youtube 无链接", target: "品牌提及" },

    // ================= Tab 7：谷歌广告 =================
    { title: "账户架构与广告类型", category: "Tab 7 - 谷歌广告", url: "tab7.html", keywords: "账户架构 搜索广告 展示广告 pmax 效果最大化 再营销", target: "搜索广告" },
    { title: "关键词匹配类型", category: "Tab 7 - 谷歌广告", url: "tab7.html", keywords: "广泛匹配 词组匹配 完全匹配 否定匹配", target: "广泛匹配" },
    { title: "质量得分三要素", category: "Tab 7 - 谷歌广告", url: "tab7.html", keywords: "质量得分 quality score 点击率 广告相关性 着陆页体验", target: "质量得分" },
    { title: "出价策略与黄金法则", category: "Tab 7 - 谷歌广告", url: "tab7.html", keywords: "出价策略 cpc tcpa troas b2b法则", target: "出价策略" },

    // ================= Tab 8：数据分析 =================
    { title: "GA4 基础设置", category: "Tab 8 - 数据分析", url: "tab8.html", keywords: "ga4 google analytics 视图 报告", target: "GA4" },
    { title: "GTM 代码管理", category: "Tab 8 - 数据分析", url: "tab8.html", keywords: "gtm google tag manager 变量 触发器 代码", target: "GTM" },
    { title: "转化追踪", category: "Tab 8 - 数据分析", url: "tab8.html", keywords: "转化追踪 归因模型 事件追踪", target: "转化追踪" },
    { title: "用户体验追踪工具", category: "Tab 8 - 数据分析", url: "tab8.html", keywords: "lucky orange 热力图 录屏", target: "Lucky Orange" },

    // ================= Tab 9：转化率优化 =================
    { title: "着陆页设计与 AIDA", category: "Tab 9 - 转化率优化", url: "tab9.html", keywords: "cro 转化率优化 着陆页 landing page aida", target: "着陆页" },
    { title: "转化元素与弹窗", category: "Tab 9 - 转化率优化", url: "tab9.html", keywords: "感谢页 挽留弹窗 询盘表单 pdf下载", target: "挽留弹窗" },
    { title: "邮件营销 (EDM)", category: "Tab 9 - 转化率优化", url: "tab9.html", keywords: "edm 邮件营销 mailerlite 自动化工作流", target: "EDM" },

    // ================= Tab 10：AI Overviews =================
    { title: "AI Overviews 核心地位", category: "Tab 10 - AI Overviews", url: "tab10.html", keywords: "ai overviews 商业决策 引用率", target: "AI Overviews" },
    { title: "查询扇出与评估信号", category: "Tab 10 - AI Overviews", url: "tab10.html", keywords: "查询扇出 query fan-out 来源权威 评估信号", target: "查询扇出" },
    { title: "GEO 四步框架", category: "Tab 10 - AI Overviews", url: "tab10.html", keywords: "geo 框架 主题权威地图 知识图谱", target: "主题权威地图" },
    { title: "实操清单 (Checklist)", category: "Tab 10 - AI Overviews", url: "tab10.html", keywords: "checklist 实体密度 月度清单", target: "Checklist" }
];

window.googleDB = googleDB;
