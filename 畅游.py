# -*- coding: utf-8 -*-
# @Time: 2023年03月13日13时39分
# @File: 畅游.py
# @auth: Dreamfeelings
import requests
'''
抓包抓 Authorization
'''
Authorization = ''

#签到
def singin(Authorization):
    headers = {
        "Authorization": Authorization,
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; 22011211C Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.117 Mobile Safari/537.36; unicom{version:android@10.0200,desmobile:13185791278};devicetype{deviceBrand:Xiaomi,deviceModel:22011211C};{yw_code:}",
    }
    url = "https://game.wostore.cn/api/app/user/v2/signIn"
    response = requests.get(url, headers=headers)
    print(response.text)
def lottery(Authorization):
    headers = {
        "Authorization": Authorization ,
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; 22011211C Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.117 Mobile Safari/537.36; unicom{version:android@10.0200,desmobile:13185791278};devicetype{deviceBrand:Xiaomi,deviceModel:22011211C};{yw_code:}",
    }
    url = "https://game.wostore.cn/api/app/user/v2/benefit/lottery"
    params = {
        "id": "1"
    }
    response = requests.get(url, headers=headers, params=params)
    print(response.text)

if __name__ == '__main__':
    singin(Authorization)
    lottery(Authorization)

