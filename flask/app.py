from flask import Flask
from flask import request
import requests
import json
from kw import kwFirstUrl
import re


# 酷我接口依赖请求headers（随时会失效，需要自行抓包）
cookie = "Hm_Iuvt_cdb524f42f0ce19b169b8072123a4727=mkR3Szf2JtpK3DtZ3zzYTyXPDDeNmsY7"
Secret = "3337285fa9fe8b3bf44f9d0b97a2eda70ecf83d1e99464db3c38699fc9ca4e0c01455ef3"

app = Flask(__name__)
# 注释的部分是用来存储用户歌单的云存储服务，如你没有私有化部署的需求可无视
'''
# 利用leancloud的数据存储云服务存储用户的歌单
def leancloud(method, id='0', list='0'):
    headers = {
        'X-LC-Id': '***********', # 你的leancloud X-LC-Id
        'X-LC-Key': '***********', # 你的leancloud X-LC-Key
        'Content-Type': 'application/json'
    }
    if method == 'get':
        getUrl = f'https://你的Baseurl/1.1/classes/musicBox?where=%7b%22ID%22%3a%7b%22%24in%22%3a%5b%22{id}%22%5d%7d%7d'
        return requests.get(url=getUrl, headers=headers).text
    else:
        getUrl = f'https://你的Baseurl/1.1/classes/musicBox?order=-ID&limit=1'
        postUrl = f'https://你的Baseurl/1.1/classes/musicBox'
        lastID = int(requests.get(url=getUrl, headers=headers).json()[
                     "results"][0]["ID"])
        data = {
            'ID': str(lastID + 1),
            'Name': json.loads(list)["name"],
            'List': json.loads(list)["list"]
        }
        print(json.dumps(data))
        requests.post(url=postUrl, headers=headers, data=json.dumps(data)).text
        return str(lastID + 1)
'''

@app.route('/')
def kuwoAPI():
    name = request.args.get('name')
    pn = request.args.get('pn')
    url = f"http://kuwo.cn/api/www/search/searchMusicBykeyWord?key={name}&pn={pn}&rn=20&httpsStatus=1&plat=web_www"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67",
        "Accept": "application/json, text/plain, */*",
        "Referer": f"http://www.kuwo.cn/search/list?",
        "cookie": cookie,
        "Secret": Secret
    }
    try:
        returnText = requests.get(url, headers=headers, timeout=3).text
    except requests.Timeout:
        print('获取搜索结果超时，正在重试……')
        returnText = requests.get(url, headers=headers).text
    print(returnText)
    music_list = json.loads(returnText)["data"]["list"]
    music_list = json.dumps(music_list).encode('utf8').decode('unicode_escape')
    print(f'本次搜索内容=>{name}')
    return music_list


@app.route('/rid/')
def ridKuwoAPI():
    rid = request.args.get('rid')
    url = kwFirstUrl(rid=rid)
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50",
        "csrf": "96Y8RG5X3X64",
        "Referer": "https://www.kuwo.cn"
    }
    try:
        music_url = requests.get(url=url, headers=headers, timeout=3).text
    except requests.Timeout:
        print('获取mp3链接超时，正在重试……')
        music_url = requests.get(url=url, headers=headers).text
    # 正则提取最终url
    pattern = r'url=(.*)'
    match = re.search(pattern, music_url)
    if match:
        music_url = match.group(1)
    else:
        print("未找到URL")
    print(f'已获取到mp3文件链接=>{str(music_url)}')
    return str(music_url)


@app.route('/lrc/')
def lrcKuwoAPI():
    rid = request.args.get('rid')
    url = f'http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId={rid}&httpsStatus=1&reqId=1c3ccf60-f4a2-11ed-b93d-c5042ed5dae3'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42'
    }
    try:
        lrc = requests.get(url=url, headers=headers, timeout=3).json()["data"]["lrclist"]
    except requests.Timeout:
        print('获取歌词超时，正在重试……')
        lrc = requests.get(url=url, headers=headers).json()["data"]["lrclist"]
    print('已获取到歌词\n\n')
    return json.dumps(lrc)

'''
@app.route('/music-box-list/', methods=['GET', 'POST'])
def musicBoxList():
    method = request.args.get('method')
    if method == 'get':
        id = request.args.get('id')
        return leancloud(method='get', id=id)
    else:
        list = request.data.decode()
        return leancloud(method='post', list=list)

@app.route('/kuwolist/')
def listLoad():
    pid = request.args.get('id')
    pn = 1
    rn = 100
    url = f'https://m.kuwo.cn/newh5app/wapi/api/www/playlist/playListInfo?pid={pid}&pn={pn}&rn={rn}'
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50'
    }
    try:
        getText = requests.get(url=url, headers=headers, timeout=3).text
    except requests.Timeout:
        print('获取酷我歌单超时，正在重试……')
        getText = requests.get(url=url, headers=headers).text
    kuwoList = json.loads(getText)["data"]["musicList"]
    name = json.loads(getText)["data"]["name"]
    saveList = []
    for arr in kuwoList:
        saveList.append({
        'name': arr["name"],
        'rid': arr['rid'],
        'artist': arr['artist'],
        'pic': arr.get('pic')
    })
    list = json.dumps({
        'name': name,
        'list': saveList
    })
    id = leancloud(method='post', list=list)
    return leancloud(method='get', id=id)
'''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)