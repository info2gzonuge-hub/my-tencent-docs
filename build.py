import os, re, urllib.request
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

TARGET_DIR = 'Google-Operations-Knowledge'

def update_index_toc():
    files = [f for f in os.listdir(TARGET_DIR) if re.match(r'^tab\d+\.html$', f)]
    files.sort(key=lambda x: int(re.search(r'\d+', x).group()))
    toc_items = []
    for filename in files:
        filepath = os.path.join(TARGET_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            title_tag = soup.find('h1') or soup.find('title')
            title_text = title_tag.get_text().strip() if title_tag else filename
            toc_items.append(f'            <button class="tab-btn" onclick="location.href=\'{filename}\'">{title_text}</button>')
    
    new_toc = "<!-- TOC_START -->\n" + "\n".join(toc_items) + "\n            <!-- TOC_END -->"
    index_path = os.path.join(TARGET_DIR, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(re.sub(r'<!-- TOC_START -->.*?<!-- TOC_END -->', new_toc, content, flags=re.DOTALL))

def update_google_algo():
    url = "https://developers.google.com/search/blog/rss/google-search-central-blog.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        xml_data = urllib.request.urlopen(req, timeout=10).read()
        items = ET.fromstring(xml_data).findall('.//item')[:3]
        
        algo_list = []
        for item in items:
            title = item.findtext('title')
            link = item.findtext('link')
            pub_date = (item.findtext('pubDate') or '')[:10]
            
            card_html = f'''            <div class="timeline-card" style="border-color: var(--secondary);">
                <div class="time-side" style="color: var(--secondary);">{pub_date}<br><span style="font-size:12px; font-weight:normal; margin-top:4px;">官方更新</span></div>
                <div class="content-side">
                    <div class="title"><a href="{link}" target="_blank" style="color: var(--text-dark); text-decoration: none;">{title}</a></div>
                    <div class="bubble">🗣️ 谷歌搜索中心官方博客最新发布... <a href="{link}" target="_blank" style="color: var(--secondary); text-decoration: underline;">阅读原文</a></div>
                </div>
            </div>'''
            algo_list.append(card_html)
            
        new_algo = "<!-- ALGO_START -->\n" + "\n".join(algo_list) + "\n            <!-- ALGO_END -->"
        
        tab1_path = os.path.join(TARGET_DIR, 'tab1.html')
        with open(tab1_path, 'r', encoding='utf-8') as f:
            content = f.read()
        with open(tab1_path, 'w', encoding='utf-8') as f:
            f.write(re.sub(r'<!-- ALGO_START -->.*?<!-- ALGO_END -->', new_algo, content, flags=re.DOTALL))
    except Exception as e:
        print(f"抓取失败: {e}")

if __name__ == '__main__':
    update_index_toc()
    update_google_algo()
