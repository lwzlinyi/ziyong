#齐鲁工会签到 单机版
#本人自用  单位要求的，不是羊毛
#抓包Authorization，在第六行自行替换，带着“Bearer ”

import requests
Authorization = 'Bearer xxxxxxxxxx'

#签到
def singin(Authorization):
    headers = {
        "Authorization":Authorization,
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; RMX3562 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36",
        "version":"v2",
        "x-glgh-geo":"",
        "x-qlgh-version":"a2.3.9",
        "Content-Type":"application/x-www-form-urlencoded",
        }
    url = "https://qlgh.sdgh.org.cn/user-api/api/me/sign"
    data = {"laborId":"O0000000000000032268",
     		"userId":"" 
    		}		
    response = requests.post(url, data=data,headers=headers)
    print(response.text)
   
#积分查询
def singin(Authorization):
        headers = {
            "Authorization":Authorization,
            "User-Agent": "Mozilla/5.0 (Linux; Android 13; RMX3562 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36",
            "version":"v2",
            "x-glgh-geo":"",
            "x-qlgh-version":"a2.3.9",
            "Content-Type":"application/x-www-form-urlencoded",
           }
        url = "https://qlgh.sdgh.org.cn/rule-search/api/sce/summarizing/my"
       	
        response = requests.get(url, headers=headers)
        result = response.json()
        sce = result["data"]
        print('当前积分：',sce)
        
if __name__ == '__main__':
    singin(Authorization)          
      
        
