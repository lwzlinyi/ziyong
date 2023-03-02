"""
什么值得买自动签到脚本

借鉴（copy）自lws1122,fork 自:https://gitee.com/lsw1122/smzdm_bot
"""
'''
cron: 0 1 * * * smzdm_auto_sign_bot.py
new Env('张大妈自动签到');
'''

import requests, os, datetime, sys
from sys import argv
import requests
import json
import time
import hmac
import hashlib
import base64
import urllib.parse

"""
http headers
"""
DEFAULT_HEADERS = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'Host': 'zhiyou.smzdm.com',
    'Referer': 'https://www.smzdm.com/',
    'Sec-Fetch-Dest': 'script',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/108.0.0.0',
}

# 签到用的url
SIGN_URL = 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin'

# 环境变量中用于存放cookie的key值
KEY_OF_COOKIE = "SMZDM_COOKIE"

TG_TOKEN = ''
TG_USER_ID = ''
# serverJ
SCKEY = ''
# push+
PUSH_PLUS_TOKEN = ''
# 钉钉机器人
DD_BOT_TOKEN = ''
DD_BOT_SECRET = ''

if "TG_BOT_TOKEN" in os.environ and len(os.environ["TG_BOT_TOKEN"]) > 1 and "TG_USER_ID" in os.environ and len(
        os.environ["TG_USER_ID"]) > 1:
    TG_TOKEN = os.environ["TG_BOT_TOKEN"]
    TG_USER_ID = os.environ["TG_USER_ID"]

if "PUSH_KEY" in os.environ and len(os.environ["PUSH_KEY"]) > 1:
    SCKEY = os.environ["PUSH_KEY"]

if "DD_BOT_TOKEN" in os.environ and len(os.environ["DD_BOT_TOKEN"]) > 1 and "DD_BOT_SECRET" in os.environ and len(
        os.environ["DD_BOT_SECRET"]) > 1:
    DD_BOT_TOKEN = os.environ["DD_BOT_TOKEN"]
    DD_BOT_SECRET = os.environ["DD_BOT_SECRET"]

if "PUSH_PLUS_TOKEN" in os.environ and len(os.environ["PUSH_PLUS_TOKEN"]) > 1:
    PUSH_PLUS_TOKEN = os.environ["PUSH_PLUS_TOKEN"]


def logout(self):
    print("[{0}]: {1}".format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), self))
    sys.stdout.flush()


def push_via_boot(title, content):
    dingding_bot(title, content)
    telegram_bot(title, content)
    serverJ(title, content)
    push_plus_bot(title, content)


def dingding_bot(title, content):
    if not DD_BOT_TOKEN or not DD_BOT_SECRET:
        print("钉钉推送服务的DD_BOT_TOKEN或者DD_BOT_SECRET未设置!!\n取消推送")
        return
    timestamp = str(round(time.time() * 1000))  # 时间戳
    secret_enc = DD_BOT_SECRET.encode('utf-8')
    string_to_sign = '{}\n{}'.format(timestamp, DD_BOT_SECRET)
    string_to_sign_enc = string_to_sign.encode('utf-8')
    hmac_code = hmac.new(secret_enc, string_to_sign_enc, digestmod=hashlib.sha256).digest()
    sign = urllib.parse.quote_plus(base64.b64encode(hmac_code))  # 签名
    print('开始使用 钉钉机器人 推送消息...', end='')
    url = f'https://oapi.dingtalk.com/robot/send?access_token={DD_BOT_TOKEN}&timestamp={timestamp}&sign={sign}'
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    data = {
        'msgtype': 'text',
        'text': {'content': f'{title}\n\n{content}'}
    }
    response = requests.post(url=url, data=json.dumps(data), headers=headers, timeout=15).json()
    if not response['errcode']:
        print('推送成功！')
    else:
        print('推送失败！')


def telegram_bot(title, content):
    try:
        print("\n")
        bot_token = TG_TOKEN
        user_id = TG_USER_ID
        if not bot_token or not user_id:
            print("tg服务的bot_token或者user_id未设置!!\n取消推送")
            return
        print("tg服务启动")
        url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        payload = {'chat_id': str(TG_USER_ID), 'text': f'{title}\n\n{content}', 'disable_web_page_preview': 'true'}
        proxies = None

        try:
            response = requests.post(url=url, headers=headers, params=payload, proxies=proxies).json()
        except:
            print('推送失败！')
        if response['ok']:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)


# push推送
def push_plus_bot(title, content):
    try:
        print("\n")
        if not PUSH_PLUS_TOKEN:
            print("PUSHPLUS服务的token未设置!!\n取消推送")
            return
        print("PUSHPLUS服务启动")
        url = 'http://pushplus.hxtrip.com/send'
        data = {
            "token": PUSH_PLUS_TOKEN,
            "title": title,
            "content": content
        }
        body = json.dumps(data).encode(encoding='utf-8')
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url=url, data=body, headers=headers).json()
        if response['code'] == 200:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)


def serverJ(title, content):
    try:
        print("\n")
        if not SCKEY:
            print("server酱服务的SCKEY未设置!!\n取消推送")
            return
        print("serverJ服务启动")
        data = {
            "title": title,
            "desp": content.replace("\n", "\n\n")
        }
        response = requests.post("https://sctapi.ftqq.com/{SCKEY}.send", data=data).json()
        if response['errno'] == 0:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)


class SignBot(object):

    def __init__(self):
        self.session = requests.Session()
        # 添加 headers
        self.session.headers = DEFAULT_HEADERS

    def __json_check(self, msg):
        """
        对请求 盖乐世社区 返回的数据进行进行检查
        1.判断是否 json 形式
        """
        try:
            result = msg.json()
            return True
        except Exception as e:
            logout(f'Error : {e}')
            return False

    def load_cookie_str(self, cookies):
        """
        起一个什么值得买的，带cookie的session
        cookie 为浏览器复制来的字符串
        :param cookie: 登录过的社区网站 cookie
        """
        self.session.headers['Cookie'] = cookies

    def checkin(self):
        """
        签到函数
        """
        msg = self.session.get(SIGN_URL)
        if self.__json_check(msg):
            return msg.json()
        return msg.content


if __name__ == '__main__':
    bot = SignBot()
    cookies = os.environ[KEY_OF_COOKIE]
    cookieList = cookies.split("&")
    logout("检测到{}个cookie记录\n开始签到".format(len(cookieList)))
    index = 0
    for c in cookieList:
        bot.load_cookie_str(c)
        result = bot.checkin()
        msg = "\n⭐⭐⭐签到成功{1}天⭐⭐⭐\n🏅🏅🏅金币[{2}]\n🏅🏅🏅积分[{3}]\n🏅🏅🏅经验[{4}],\n🏅🏅🏅等级[{5}]\n🏅🏅补签卡[{6}]".format(
            index,
            result['data']["checkin_num"],
            result['data']["gold"],
            result['data']["point"],
            result['data']["exp"],
            result['data']["rank"],
            result['data']["cards"])
        logout(msg)
        logout("开始推送，暂时支持【Telegram】【钉钉】【push+】【serverJ】")
        push_via_boot("张大妈自动签到", msg)
        # telegram_bot("张大妈自动签到", msg)
        index += 1
    logout("签到结束")
