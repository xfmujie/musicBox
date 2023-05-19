from flask import Flask
from flask import request
import requests
import json

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


app = Flask(__name__)


@app.route('/')
def kuwoAPI():
    name = request.args.get('name')
    pn = request.args.get('pn')
    url = 'https://kuwo.cn/'
    # 保存这次访问的cookies
    html = requests.session()
    html.get(url)
    csrf = html.cookies.get_dict()['kw_token']
    print('token:', csrf)

    url = f'https://kuwo.cn/api/www/search/searchMusicBykeyWord?key={name}&pn={pn}&rn=30&httpsStatus=1'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
        'Accept': 'application/json, text/plain, */*',
        'csrf': csrf,
        'Referer': 'https://kuwo.cn',
    }
    music_list = html.get(url, headers=headers).json()["data"]["list"]

    music_list = json.dumps(music_list).encode('utf8').decode('unicode_escape')
    print(f'本次搜索内容=>\n{name}')
    return music_list


@app.route('/rid/')
def ridKuwoAPI():
    rid = request.args.get('rid')
    url = f'http://www.kuwo.cn/api/v1/www/music/playUrl?mid={rid}&type=convert_url3&br=320kmp3'
    download_url = requests.get(url=url).json()["data"]["url"]
    print(f'已获取到mp3文件链接=>\n{str(download_url)}')
    return str(download_url)


@app.route('/lrc/')
def lrcKuwoAPI():
    rid = request.args.get('rid')
    url = f'http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId={rid}&httpsStatus=1&reqId=1c3ccf60-f4a2-11ed-b93d-c5042ed5dae3'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42'
    }
    lrc = requests.get(url=url, headers=headers).json()["data"]["lrclist"]
    print('已获取到歌词\n\n')
    return json.dumps(lrc)


@app.route('/music-box-list/', methods=['GET', 'POST'])
def musicBoxList():
    method = request.args.get('method')
    if method == 'get':
        id = request.args.get('id')
        return leancloud(method='get', id=id)
    else:
        list = request.data.decode()
        return leancloud(method='post', list=list)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)