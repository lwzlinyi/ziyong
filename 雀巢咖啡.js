/**
 * 
 * 项目类型：微信小程序
 * 项目名称：雀巢咖啡 - 爱豆庄园
 * 项目抓包：抓coffeefarm.shheywow.com/api/user/auth下的openid & unionid填入变量
 * 项目变量：lekebo_qckf_Cookie
 * 项目定时：每天运行二次
 * cron: 30 6,18 * * *
 * github仓库：https://github.com/
 * 
 * 
 */

//===============脚本版本=================//
let scriptVersion = "1.0.1";
let update_data = "完成签到、分享、邀请、培育、步数等任务";
//=======================================//
const $ = new Env("雀巢咖啡 - 爱豆庄园");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0			//0为关闭调试,1为打开调试,默认为0
//---------------------------------------------------------------------------------------------------------
const {log} = console;
let scriptVersionLatest = "";
let UserCookie = ($.isNode() ? process.env.lekebo_qckf_Cookie : $.getdata('lekebo_qckf_Cookie')) || '';
let UserCookieArr = [];
let data = '';
let msg =``;
let ck, ck_status;
var timestamp = Math.round(new Date().getTime()).toString();
let host = 'coffeefarm.shheywow.com';
let hostname = 'https://' + host;
//=======================================//
!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs())){
            return;
        } else {
            DoubleLog(`\n test `)
            await getVersion();
            DoubleLog(`\n================ 共找到 ${UserCookieArr.length} 个账号 ================ \n 脚本执行✌北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} \n================ 版本对比检查更新 ================`);          
            if (scriptVersionLatest != scriptVersion) {
                DoubleLog(`\n 当前版本：${scriptVersion}`)
                DoubleLog(`\n 最新版本：${scriptVersionLatest}`)
                DoubleLog(`\n 更新信息：${update_data}`)
            } else {
                DoubleLog(`\n 版本信息：${scriptVersion} ，已是最新版本无需更新开始执行脚本`)
            }
            for (let index = 0; index < UserCookieArr.length; index++) {
                let num = index + 1
                DoubleLog(`\n================ 开始第 ${num} 个账号 ================`)
                ck = UserCookieArr[index].split("&");
                taskBeforeScore = 0;
                await start();
				if (local_hours() == 18) {
            		await tree_info(2 * 1000);
					await $.wait(2000);
        		} else {
            		console.log(`\n 荫树爱豆: ❌ ，每天18点领取 ,时间不对,跳过!`);
        		}
				await getMemberInfo(2,2 * 1000);
            }
            await SendMsg(msg);
        }
    }

})()
    .catch((e) => log(e))
    .finally(() => $.done())

/**
 * 获取基础信息
 * @returns {Promise<boolean>}
 */
async function start() {
	await login(2 * 1000);
    await $.wait(2000);
    await getMemberInfo(1,2 * 1000);
    await $.wait(2000);
	await treeCred(2 * 1000);
    await $.wait(2000);
    await taskList(2 * 1000);
    await $.wait(2000);
    return true;
}
/**
 * 登录
 * @param timeout
 * @returns {Promise<unknown>}
 */
function login(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/auth`,
            headers: {
                'Host': host,
			    'Content-Type': 'application/json',
				'Content-Length': '283',
            },
			body: `{"openid":"${ck[0]}","unionid":"${ck[1]}"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
					tokne = result.data.token;
			        DoubleLog(`\n 登录成功: ✅ ，已获取最新token`);
		        } else {
                    DoubleLog(`\n 登录失败: ❌ ，${result.error_message}`);
                }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 查询会员信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function getMemberInfo(task,timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/index`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"share_id":"0","shareType":"1"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (task == 1) {
					lang_id = result.data.user.new_land_id;
                    DoubleLog(`\n 用户信息: ✅ ，${result.data.user.name}，庄园ID: ${result.data.user.new_land_id} 当前 ${result.data.user.credit} 爱豆`)
					if (result.data.user.credit > 120) {
            			await breed(2 * 1000);
        			}
				} else if (task == 2) {
					DoubleLog(`\n 爱豆查询: ✅ ，签到后有积分 ${result.data.user.credit}`);
                } else {
                    DoubleLog(`\n 登录失败: ❌ ，原因是：${data}`)
                }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 培育
 * @param timeout
 * @returns {Promise<unknown>}
 */
function breed(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/v2/user/land/culture/v2`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"landId":"${lang_id}","collectType":"0"}`,
        }
		//console.log(url)
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
				//console.log(result)
                if (result.error_code == 0) {
		            DoubleLog(`\n 培育成功: ✅ ，${result.error_message}`);
	            } else {
		            DoubleLog(`\n 培育失败: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 任务列表
 * @param timeout
 * @returns {Promise<unknown>}
 */
function taskList(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/list`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
		            if (result.data.sign.status == 0) {
                        DoubleLog(`\n 签到状态: ✅ ，今日还没签到 ,去签到!`);
                        await signIn(2 * 1000);
                    } else {
                        DoubleLog(`\n 签到状态: ❌ ，今日签到过了 ,明天再来吧!`);
                    }
					if (result.data.share.status == 0) {
        			    DoubleLog(`\n 每日分享: ✅ ，每日分享未完成 ,去分享喽!`);
        			    await share(2 * 1000);
        			    await share_Reward(2 * 1000);
        			} else {
        			    DoubleLog(`\n 每日分享: ❌ ，今日每日分享过了 ,明天再来吧!`);
        			}
					if (result.data.invitation.status != 0 && result.data.invitation.credit != 0) {
         			   console.log(`\n 邀请好友: ✅ ，可以领取爱豆 ${result.data.invitation.credit}`);
         			   await invitation_Reward(2 * 1000);
        			} else {
            			console.log(`\n 邀请好友: ❌ ，暂无可领取爱豆!`);
        			}
					if (result.data.foster.num < 3) {
            			console.log(`\n 好友培育: ✅ ，${result.data.foster.num}/3`);
            			if (result.data.foster.num < 3) {
                			await friend_breed_info(2 * 1000);
            			}
        			} else {
            			console.log(`\n 好友培育: ❌ ，今日完成了 ,明天再来吧!`);
        			}
					if (result.data.run.show != 0 && result.data.run.credit != 0) {
            			console.log(`\n 微信步数: ✅ ，预计可以领取爱豆 ${result.data.run.credit}`);
            			if (local_hours() == 18) {
                			await wechat_step(2 * 1000);
            			} else {
                			console.log(`\n 微信步数: ❌ ，每天18点领取 ,时间不对,跳过!`);
            			}
        			} else {
            			console.log(`\n 微信步数: ❌ ，暂无可领取爱豆!`);
        			}
	            } else {
		            DoubleLog(`\n 任务列表: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 签到
 * @param timeout
 * @returns {Promise<unknown>}
 */
function signIn(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/sign`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
		            DoubleLog(`\n 签到成功: ✅ ，获得 ${result.data.list[0].credit} 爱豆`);
	            } else {
		            DoubleLog(`\n 签到失败: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 每日分享
 * @param timeout
 * @returns {Promise<unknown>}
 */
function share(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/share`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
		            DoubleLog(`\n 分享成功: ✅ ，获得 ${result.data.credit} 爱豆`);
	            } else {
		            DoubleLog(`\n 分享失败: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 领取领取每日分享奖励
 * @param timeout
 * @returns {Promise<unknown>}
 */
function share_Reward(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/share/get/credit`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
		            DoubleLog(`\n 领取分享: ✅ ，奖励成功了`);
	            } else {
		            DoubleLog(`\n 领取分享: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 领取邀请奖励
 * @param timeout
 * @returns {Promise<unknown>}
 */
function invitation_Reward(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/invitation/get/credit`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
		            DoubleLog(`\n 领取邀请: ✅ ，奖励成功了`);
	            } else {
		            DoubleLog(`\n 领取邀请: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 好友培育信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function friend_breed_info(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/friend/listv2`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"landId":"${lang_id}"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
					if (result.data.friends.length > 3) {
            			DoubleLog(`\n 好友培育: ✅ ，您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行 好友培育 任务!`);
            			for (let index = 1; index < 4; index++) {
                			let friend_id = result.data.friends[index].manor.user_id;
                			let friend_name = result.data.friends[index].manor.name;
                			let landId = result.data.friends[index].land.id;
                			DoubleLog(`\n 好友培育: ✅ ，培育好友 ${friend_name} ,庄园id：${landId}`);
                			await friend_breed(friend_id, landId);
            			}
            			await friend_breed_Reward(2 * 1000);
        			} else {
            			DoubleLog(`\n 好友培育: ❌ ，您当前有 ${result.data.friends.length - 1} 个好友 ,跳过 好友培育 任务!`);
        			}
	            } else {
		            DoubleLog(`\n 好友培育: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 好友培育
 * @param timeout
 * @returns {Promise<unknown>}
 */
function friend_breed(friend_id,landId,timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/friend/foster/add`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"friendId":"${friend_id}","landId":"${landId}"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
					DoubleLog(`\n 好友培育: ✅ ，成功了`);
	            } else {
		            DoubleLog(`\n 好友培育: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 领取好友培育奖励
 * @param timeout
 * @returns {Promise<unknown>}
 */
function friend_breed_Reward(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/foster/friend/get/credit`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
					DoubleLog(`\n 培育奖励: ✅ ，培育奖励成功了`);
	            } else {
		            DoubleLog(`\n 培育奖励: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 微信步数
 * @param timeout
 * @returns {Promise<unknown>}
 */
function wechat_step(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/taskv2/invitation/get/credit`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
					DoubleLog(`\n 微信步数: ✅ ，领取步数奖励成功了`);
	            } else {
		            DoubleLog(`\n 微信步数: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 荫蔽树爱豆
 * @param timeout
 * @returns {Promise<unknown>}
 */
function tree_info(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/land/tree/credit/list`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"landId":"${lang_id}"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.data.creditList.length != 0) {
					for (var key in result.data.creditList) {
            			let tree_idol_id = JSON.stringify(result.data.creditList[key].id);
            			await tree_Receive(tree_idol_id);
        			}
				} else if (result.error_code == 0) {
        			DoubleLog(`\n 荫树爱豆: ❌ ，荫蔽树上暂时没有爱豆,等等吧`);
	            } else {
		            DoubleLog(`\n 荫树爱豆: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 领取荫蔽树爱豆
 * @param timeout
 * @returns {Promise<unknown>}
 */
function tree_Receive(id,timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/user/land/tree/credit/getV2`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json'
            },
			body: `{"treeCreditId":"${id}"}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
        			DoubleLog(`\n 荫树爱豆: ✅ ，领取奖励成功了`);
	            } else {
		            DoubleLog(`\n 荫树爱豆: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 领取荫蔽树爱豆
 * @param timeout
 * @returns {Promise<unknown>}
 */
function treeCred(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/api/v2/user/land/tree/credit/getV2`,
            headers: {
                'Host': host,
			    'Authorization': `Bearer ${tokne}`,
			    'Content-Type': 'application/json',
				'Content-Length': '24',
            },
			body: `{"treeCreditId":8311146}`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.error_code == 0) {
        			DoubleLog(`\n 收取爱豆: ✅ ，领取奖励成功了`);
	            } else {
		            DoubleLog(`\n 收取爱豆: ❌ ，失败原因是：${result.error_message}`)
	            }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}









// ============================================重写============================================ \\
async function GetRewrite() {
    if ($request.url.indexOf("club-server/front/member/home") > -1) {
		let ck_az = $request.headers.Authorization;
		let ck_id = $request.headers['X-Customer'];
		ck = `${ck_id}&${ck_az}`;
		if (ckStr) {
			if (ckStr.indexOf(ck_id) == -1) {  // 找不到返回 -1
				ckStr = ckStr + "@" + ck;
				$.setdata(ckStr, "lekebo_qckf_Cookie");
				ckList = ckStr.split("@");
				$.msg($.name + ` 获取第${ckList.length}个 ck 成功: ${ck}`);
			}
		} else {
			$.setdata(ck, "lekebo_qckf_Cookie");
			$.msg($.name + ` 获取第1个 ck 成功: ${ck}`);
		}
	}
}


// ============================================变量检查============================================ \\
async function Envs() {
    if (UserCookie) {
        if (UserCookie.indexOf("@") != -1) {
            UserCookie.split("@").forEach((item) => {
                UserCookieArr.push(item);
            });
        } else if (UserCookie.indexOf("\n") != -1) {
            UserCookie.split("\n").forEach((item) => {
                UserCookieArr.push(item);
            });
        } else {
            UserCookieArr.push(UserCookie);
        }
    } else {
        console.log(`\n 乐客播提示：系统变量未填写 lekebo_qckf_Cookie`)
        return;
    }
    return true;
}
// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        log(message);
    }
}
/**
 * 添加消息
 * @param str
 * @param is_log
 */
function addNotifyStr(str, is_log = true) {
    if (is_log) {
        log(`${str}\n`)
    }
    msg += `${str}\n`
}
/**
 * 双平台log输出
 */
function DoubleLog(data) {
	if ($.isNode()) {
		if (data) {
			console.log(`${data}`);
			msg += `${data}`;
		}
	} else {
		console.log(`${data}`);
		msg += `${data}`;
	}
}
function randomNum(min, max) {
	if (arguments.length === 0) return Math.random()
	if (!max) max = 10 ** (Math.log(min) * Math.LOG10E + 1 | 0) - 1
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function DealScriptStr(str) {
    str = str.replace(/\/\*.*?\*\//g, ' ');
    str = str.replace(/\b0(\d+)/g, '0o$1');
    return str;
}
/**
 * 随机UA
 * @param inputString
 * @returns {*}
 */
function getUA() {
	$.UUID = randomString(40)
	const buildMap = {
		"167814": `10.1.4`,
		"167841": `10.1.6`,
		"167853": `10.2.0`
	}
	$.osVersion = `${randomNum(13, 14)}.${randomNum(3, 6)}.${randomNum(1, 3)}`
	let network = `network/${['4g', '5g', 'wifi'][randomNum(0, 2)]}`
	$.mobile = `iPhone${randomNum(9, 13)},${randomNum(1, 3)}`
	$.build = ["167814", "167841", "167853"][randomNum(0, 2)]
	$.appVersion = buildMap[$.build]
	return `jdapp;iPhone;${$.appVersion};${$.osVersion};${$.UUID};M/5.0;${network};ADID/;model/${$.mobile};addressid/;appBuild/${$.build};jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${$.osVersion.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}

/**
 * 随机数生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
/**
 * 获取当前小时数
 */
function local_hours() {
    let myDate = new Date();
    h = myDate.getHours();
    return h;
}
/**
 * 修改配置文件
 */
function modify() {
    fs.readFile('/ql/data/config/config.sh','utf8',function(err,dataStr){
        if(err){
            return log('读取文件失败！'+err)
        }
        else {
            var result = dataStr.replace(/regular/g,string);
            fs.writeFile('/ql/data/config/config.sh', result, 'utf8', function (err) {
                if (err) {return log(err);}
            });
        }
    })
}

/**
 * 获取远程版本
 */
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_kww.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                scriptVersionLatest = data.match(/scriptVersion = "([\d\.]+)"/)[1]
                update_data = data.match(/update_data = "(.*?)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
