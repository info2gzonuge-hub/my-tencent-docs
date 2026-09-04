import os, re, urllib.request
import xml.etree.ElementTree as ET
from openai import OpenAI

TARGET_DIR = 'Google-Operations-Knowledge'
API_KEY = os.environ.get("DEEPSEEK_API_KEY")

def get_ai_summary(title, description, pub_date, link):
    if not API_KEY:
        print("未检测到 API Key，请检查 GitHub Secrets 配置")
        return ""
    
    client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")
    prompt = f"""
    你是一个拥有10年经验的谷歌独立站SEO操盘手。请阅读以下海外SEO新闻：
    英文原标题：{title}
    摘要内容：{description}
    
    请完成以下2个任务：
    1. 中文短标题：将原标题浓缩并翻译成极简的专业中文标题（例如“9月核心算法波动”或“打击寄生虫SEO”），严格控制在 15 个字以内。
    2. 大白话总结：用一句中文大白话总结核心内容。必须切中独立站卖家的真实痛点，可以带点行业吐槽（例如“流量还得自己拼”），不超过 50 个字。

    然后，严格按以下HTML结构输出，绝对不要输出任何Markdown标记或反引号，直接输出纯代码：
    <div class="timeline-card">
        <div class="time-side" style="color: #ff6b4a; font-weight: bold;">{pub_date}<br><span style="font-size:12px; font-weight:normal; margin-top:4px;">🤖 DS 智能提炼</span></div>
        <div class="content-side">
            <div class="title"><a href="{link}" target="_blank" style="color: var(--text-dark); text-decoration: none;">[请在这里填入你生成的中文短标题]</a></div>
            <div class="bubble">🥷 [请在这里填入你的大白话总结] <a href="{link}" target="_blank" style="color: #ff6b4a; text-decoration: underline;">查阅出处 ↗</a></div>
        </div>
    </div>
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        # 清理可能存在的 Markdown 代码块残留
        html_code = response.choices[0].message.content.replace('```html', '').replace('```', '').strip()
        return html_code
    except Exception as e:
        print(f"AI 生成失败: {e}")
        return ""

def update_google_algo():
    url = "https://www.seroundtable.com/index.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        xml_data = urllib.request.urlopen(req, timeout=10).read()
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        algo_list = []
        # 严选机制：只抓取包含实质性算法变动的硬核新闻
        keywords = ['update', 'algorithm', 'core', 'spam', 'ranking bug', 'leak']
        
        for item in items:
            title = item.findtext('title')
            
            # 过滤逻辑：如果标题不包含核心关键词，直接跳过，不浪费 API 额度
            if not any(kw in title.lower() for kw in keywords):
                continue
                
            description = item.findtext('description')[:600]
            link = item.findtext('link')
            pub_date = (item.findtext('pubDate') or '')[8:16] # 提取如 "03 Sep" 等更紧凑的日期格式
            
            ai_card_html = get_ai_summary(title, description, pub_date, link)
            if ai_card_html:
                algo_list.append(ai_card_html)
                
            # 每次更新只保留最新 1 条重大算法，避免刷屏
            if len(algo_list) >= 1:
                break
                
        if not algo_list:
            print("今日无重大核心算法更新，保持页面清爽。")
            return

        new_algo = "<!-- ALGO_START -->\n" + "\n".join(algo_list) + "\n            <!-- ALGO_END -->"
        
        tab1_path = os.path.join(TARGET_DIR, 'tab1.html')
        with open(tab1_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        with open(tab1_path, 'w', encoding='utf-8') as f:
            f.write(re.sub(r'<!-- ALGO_START -->.*?<!-- ALGO_END -->', new_algo, content, flags=re.DOTALL))
        print("高优算法中文提炼成功写入！")
            
    except Exception as e:
        print(f"抓取流程失败: {e}")

if __name__ == '__main__':
    update_google_algo()
