import os, re, urllib.request
import xml.etree.ElementTree as ET

TARGET_DIR = 'Google-Operations-Knowledge'

def update_google_algo():
    # 使用 Google 官方提供的无反爬风险 RSS 源
    url = "https://developers.google.com/search/blog/rss/google-search-central-blog.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        xml_data = urllib.request.urlopen(req, timeout=10).read()
        items = ET.fromstring(xml_data).findall('.//item')[:3] # 只拉取最新 3 条
        
        algo_list = []
        for item in items:
            title = item.findtext('title')
            link = item.findtext('link')
            pub_date = (item.findtext('pubDate') or '')[:10]
            
            # 生成和你 tab1 完全一致的卡片 HTML，带有蓝色标记以区分官方实时更新
            card_html = f'''            <div class="timeline-card" style="border-color: var(--secondary);">
                <div class="time-side" style="color: var(--secondary);">{pub_date}<br><span style="font-size:12px; font-weight:normal; margin-top:4px;">官方更新</span></div>
                <div class="content-side">
                    <div class="title"><a href="{link}" target="_blank" style="color: var(--text-dark); text-decoration: none;">{title}</a></div>
                    <div class="bubble">🗣️ 谷歌搜索中心官方最新发布。 <a href="{link}" target="_blank" style="color: var(--secondary); text-decoration: underline;">阅读原文 ↗</a></div>
                </div>
            </div>'''
            algo_list.append(card_html)
            
        new_algo = "<!-- ALGO_START -->\n" + "\n".join(algo_list) + "\n            <!-- ALGO_END -->"
        
        tab1_path = os.path.join(TARGET_DIR, 'tab1.html')
        with open(tab1_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换注释之间的内容
        with open(tab1_path, 'w', encoding='utf-8') as f:
            f.write(re.sub(r'<!-- ALGO_START -->.*?<!-- ALGO_END -->', new_algo, content, flags=re.DOTALL))
        print("算法更新成功！")
            
    except Exception as e:
        print(f"抓取失败，保留原样: {e}")

if __name__ == '__main__':
    update_google_algo()
