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
    你是一个拥有10年经验的谷歌SEO操盘手。请阅读以下SEO新闻：
    标题：{title}
    摘要：{description}
    
    请提取其核心信息，并用一句中文“大白话”总结（可以带点行业吐槽或黑话，切中独立站卖家的痛点，不超过50个字）。
    然后，严格按以下HTML结构输出，绝对不要输出任何Markdown标记，直接输出纯文本HTML代码：
    <div class="timeline-card" style="border-color: var(--secondary);">
        <div class="time-side" style="color: var(--secondary);">{pub_date}<br><span style="font-size:12px; font-weight:normal; margin-top:4px;">🤖 DS 智能提炼</span></div>
        <div class="content-side">
            <div class="title"><a href="{link}" target="_blank" style="color: var(--text-dark); text-decoration: none;">{title}</a></div>
            <div class="bubble">🗣️ [将你的大白话总结放在这里] <a href="{link}" target="_blank" style="color: var(--secondary); text-decoration: underline;">查阅出处 ↗</a></div>
        </div>
    </div>
    """
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
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
        items = root.findall('.//item')[:1] 
        
        algo_list = []
        for item in items:
            title = item.findtext('title')
            description = item.findtext('description')[:500]
            link = item.findtext('link')
            pub_date = (item.findtext('pubDate') or '')[5:16] 
            
            ai_card_html = get_ai_summary(title, description, pub_date, link)
            if ai_card_html:
                algo_list.append(ai_card_html)
                
        if not algo_list:
            return

        new_algo = "<!-- ALGO_START -->\n" + "\n".join(algo_list) + "\n            <!-- ALGO_END -->"
        
        tab1_path = os.path.join(TARGET_DIR, 'tab1.html')
        with open(tab1_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        with open(tab1_path, 'w', encoding='utf-8') as f:
            f.write(re.sub(r'<!-- ALGO_START -->.*?<!-- ALGO_END -->', new_algo, content, flags=re.DOTALL))
        print("DS 算法总结写入成功！")
            
    except Exception as e:
        print(f"抓取流程失败: {e}")

if __name__ == '__main__':
    update_google_algo()
