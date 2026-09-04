import os, re, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from openai import OpenAI

TARGET_DIR = 'Google-Operations-Knowledge'
API_KEY = os.environ.get("DEEPSEEK_API_KEY")

def get_ai_summary(title, description, pub_date_str, link):
    if not API_KEY:
        print("未检测到 API Key，请检查配置")
        return ""
    
    client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")
    prompt = f"""
    你是一个拥有10年经验的谷歌独立站SEO操盘手。请阅读以下海外SEO新闻：
    原标题：{title}
    摘要内容：{description}
    
    请完成以下2个任务：
    1. 中文短标题：将原标题浓缩并翻译成极简的专业中文标题，严格控制在 15 个字以内。
    2. 大白话总结：用一句中文大白话总结核心内容。必须切中独立站卖家的真实痛点，可以带点行业吐槽，不超过 50 个字。

    严格按以下HTML结构输出，注意使用 var(--primary) 保持橙色主题一致性。绝对不要输出任何Markdown标记或反引号，直接输出纯代码：
    <div class="timeline-card">
        <div class="time-side" style="color: var(--primary); font-weight: bold;">{pub_date_str}<br><span style="font-size:12px; font-weight:normal; margin-top:4px; color: var(--text-muted);">🤖 DS 智能提炼</span></div>
        <div class="content-side">
            <div class="title"><a href="{link}" target="_blank" style="color: var(--text-dark); text-decoration: none;">[替换为生成的中文短标题]</a></div>
            <div class="bubble">🥷 [替换为生成的大白话总结] <a href="{link}" target="_blank" style="color: var(--primary); text-decoration: underline;">查阅出处 ↗</a></div>
        </div>
    </div>
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content.replace('```html', '').replace('```', '').strip()
    except Exception as e:
        print(f"AI 生成失败: {e}")
        return ""

def update_google_algo():
    tab1_path = os.path.join(TARGET_DIR, 'tab1.html')
    with open(tab1_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 提取当前页面已经沉淀的卡片链接，作为“去重比对库”
    algo_block_match = re.search(r'<!-- ALGO_START -->(.*?)<!-- ALGO_END -->', content, flags=re.DOTALL)
    existing_links = []
    if algo_block_match:
        existing_links = re.findall(r'href="(.*?)"', algo_block_match.group(1))

    url = "https://www.seroundtable.com/index.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        xml_data = urllib.request.urlopen(req, timeout=10).read()
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        algo_list = []
        keywords = ['update', 'algorithm', 'core', 'spam', 'leak']
        
        for item in items:
            title = item.findtext('title')
            link = item.findtext('link')
            
            # 过滤 1：非核心算法关键词跳过
            if not any(kw in title.lower() for kw in keywords):
                continue
                
            # 过滤 2：核心机制！如果这条新闻的链接已经在页面里了，直接跳过
            if link in existing_links:
                print(f"跳过已沉淀记录: {title}")
                continue
                
            pubDate_raw = item.findtext('pubDate') 
            try:
                article_date_obj = datetime.strptime(pubDate_raw[5:16], '%d %b %Y')
                article_date_formatted = article_date_obj.strftime('%Y.%m.%d')
            except:
                continue

            description = item.findtext('description')[:600]
            
            ai_card = get_ai_summary(title, description, article_date_formatted, link)
            if ai_card:
                algo_list.append(ai_card)

        # 2. 拼装与写入页面
        if algo_list:
            # 将最新的卡片加在最前面，并保留原有的起始标签
            new_html_to_insert = "\n".join(algo_list) + "\n"
            new_content = content.replace('<!-- ALGO_START -->', '<!-- ALGO_START -->\n' + new_html_to_insert)
            
            with open(tab1_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"成功新增 {len(algo_list)} 条沉淀记录，旧数据已安全保留。")
        else:
            print("近期无全新重大算法更新，无需新增卡片。")
            
    except Exception as e:
        print(f"抓取流程失败: {e}")

if __name__ == '__main__':
    update_google_algo()
