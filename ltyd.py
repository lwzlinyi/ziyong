import requests
import time


''''
accesstoken,phoneNumber 搜索抓包，参数在请求头

开抓包看满15分钟 抽一次奖，下面参数都在请求体
sign1 抓包搜newreadadd
sign2 抓包搜 addDrawTimes
sign3 抓包搜 addReadTime
acticeindex 抓包搜 doDraw
'''

accesstoken = ""
phoneNumber4net = ""

# pushplus+推送，没有不写
token = ''
topic = ''

sign1=''

sign2=""

sign3=""

acticeindex=""


class Main():
    def __init__(self,accesstoken,phoneNumber4net,token,topic,sign1,sign2,sign3,acticeindex):
        self.headers = {
            "accesstoken": accesstoken,
        }
        self.cookies = {
            "useraccount": phoneNumber4net,
            "phoneNumber4net": phoneNumber4net,
        }
        self.token = token
        self.topic = topic
        self.sign1 = sign1
        self.sign2 = sign2
        self.sign3 = sign3
        self.acticeindex = acticeindex
        
        
        self.messsage = '>>> 沃阅读抽奖：\n\n'

        for i in range(32):
            self.newreadadd()  #获取阅读
            self.addDrawTime()  #开始阅读
            self.addReadtime()  #完成阅读
            self.lottery()   #开始抽奖
        self.push_notifacation()

        print('--------抽奖完成！--------\n\n')
        print('----------by:   Dreamfeelings')
    #获取阅读
    def newreadadd(self):
        time.sleep(2)
        print('\n--------获取阅读任务!--------\n')
        url = "https://10010.woread.com.cn/ng_woread_service/rest/basics/newreadadd"
        data = {
            "sign": self.sign1
        }
        response = requests.post(url, headers=self.headers, cookies=self.cookies, json=data)
        print(response.text)

    #开始阅读
    def addDrawTime(self):
        time.sleep(2)
        print('\n--------开始阅读!--------\n')
        data = {
            "sign": self.sign2
        }
        url = "https://10010.woread.com.cn/ng_woread_service/rest/basics/addDrawTimes"
        response = requests.post(url, headers=self.headers, cookies=self.cookies, json=data)
        print(response.text)

        print('正在阅读:    ')
        # for i in tqdm(range(1000)):
        for i in range(120):
            time.sleep(1)
        print('阅读完成！\n')

    #完成阅读
    def addReadtime(self):
        time.sleep(2)
        print('\n--------正在完成阅读任务！--------\n')
        data = {
            "sign": self.sign3
        }
        url = "https://10010.woread.com.cn/ng_woread_service/rest/history/addReadTime"
        response = requests.post(url, headers=self.headers, cookies=self.cookies, json=data).json()

        if response['code'] == '0000' :
            print(response)
            print('阅读任务提交成功！')
            return 1
        else:
            time.sleep(5)
            response = requests.post(url, headers=self.headers, cookies=self.cookies, json=data).json()
            if response['code'] == '0000' :
                print(response)
                print('阅读任务提交成功！')
                return 1
            else:
                print(response)
                print('阅读任务提交失败！')

    #开始抽奖
    def lottery(self):
        print('\n--------开始抽奖！--------\n\n')
        time.sleep(3)

        data = {
            "acticeindex": self.acticeindex,
            "t": int(time.time())
        }
        url = "https://10010.woread.com.cn/touchextenernal/actsub/doDraw.action"
        response = requests.post(url, headers=self.headers, cookies=self.cookies, data=data).json()
        print(response)
        try:
           if response['prizedesc'] != '':
               self.messsage += response['prizedesc']
        except:
           pass

    #推送消息
    def push_notifacation(self):
        title = '联通任务通知: '
        content = self.messsage

        url = 'http://www.pushplus.plus/send'
        data = {
            'token': self.token,
            'title': title,
            'content': content,
            "topic": self.topic
        }

        res = requests.post(url, data=data).json()
        # print(res)
        try:
            status = '推送成功！' if res['code'] == 200 else res['msg']
            print(status)
        except:
            print('推送异常！')

if __name__ == '__main__':
    Main(accesstoken,phoneNumber4net,token,topic,sign1,sign2,sign3,acticeindex)