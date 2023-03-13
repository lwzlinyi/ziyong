# -*- coding: utf-8 -*-
# @Time: 2023年03月13日12时44分
# @File: 联通阅读 抽奖.py
# @auth: Dreamfeelings
import requests
import time

'''
抓包抓  accesstoken  ， phoneNumber4net
'''

accesstoken = ''
phoneNumber4net = ''
token = ''  #pushplus token

#阅读抽奖
def read_lottery(accesstoken,phoneNumber4net,token):
    print('开始阅读抽奖！\n')
    result = ''
    # 抽奖
    headers = {
        "accesstoken": accesstoken,
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; 22011211C Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.117 Mobile Safari/537.36; unicom{version:android@10.0200,desmobile:13185791278};devicetype{deviceBrand:Xiaomi,deviceModel:22011211C};{yw_code:}",
    }
    cookies = {
       "phoneNumber4net": phoneNumber4net,
    }
    data = {
        "sign": "ZTU4Mjk4OTZjNzdjOTU3NDA1NDY4NjQyY2ViNjRlMzc0Mjc4MzE3MTU5ZGQ1ZDlkN2M1YzAyNTVjNGNlMDNhZTc4ZWQ0MTgwMTc4NzhiOTEzMmM0N2Q4NzlhNGI1ZDNkYzdiYzc5OTA5YzI3OTFkZjczN2I2MjY4MGUyYWJlMDI1YmM2MzAyODcwYWJiNmM2MmM5N2ZiNjljOTBiYWM5NWY3MTM2N2U1YjI4MWIwNDk5NGQ2NGZkNDU1ZjExN2VhOTg5YzkwYWE1NjFmYzQyMTY5Mzg2YjIxZGYxMDllMDJlNzIzM2E1YWFjNDAxNDA2MzA3ZThmODRmYmE5ZTEwZjUwZmFkMzljODg3ODY2YTAxZWM3ZmM0YjNiMzE3OGY0MDBkODc2MDUxYjEwOWU1ZWIyMzdlMjE0NTQwM2RiNWUxZDJlNWRjYjg2NmRiODBlOTBjOGI1YTBkNGNjYjViMGUxNzc5ZjMyMWRhMDRlMGZiZTFiYjc3MWE1MjlkYWQ3NGU4MmRmYTYzMjM0YmE5NzQyZjBmN2U0ZGE4Y2ZjZGY="
    }
    for i in range(7):
        res = requests.post('https://10010.woread.com.cn/ng_woread_service/rest/basics/doDraw', headers=headers,
                            cookies=cookies, json=data).json()
        if res['success'] == False:
            print(res['message'])
            result += res['message']
            break
        else:
            prizedesc = res['data']['prizedesc']  # 奖品信息
            result += res['message']
            print(prizedesc)
            time.sleep(2)
    pushplus(result,token)

# pushplus推送
def pushplus(content,token):
    title = '联通营业厅任务通知: '
    url = 'http://www.pushplus.plus/send'
    data = {
        'token' :token,
        'title' : title,
        'content' : content
    }

    res = requests.post(url,data=data).json()
    # print(res)
    try:
        status = '推送成功！' if res['code'] == 200 else res['msg']
        print(status)
    except:
        print('推送异常！')
if __name__ == '__main__':
    read_lottery(accesstoken,phoneNumber4net,token)