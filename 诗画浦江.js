/*
诗画浦江  app

cron 10 8,10 * * *  shpj.js

========= 青龙--配置文件--贴心复制区域  ========= 
# 诗画浦江
export shpj=' x-session-id & x-request-id ' 


多账号用 换行 或 @ 分割
tg频道: https://t.me/yml2213_tg  
*/


const utils = require("yml2213-utils")
const $ = new Env("诗画浦江")   // 1.名字改了
const ckName = "shpj"           // 2. 英文名字改一下
//-------------------- 一般不动变量区域 -------------------------------------      // 3. 不用管 
const notify = $.isNode() ? require("./sendNotify") : ""
const Notify = 1		 //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"]
let ck = msg = ''
let host, hostname
let userCookie = process.env[ckName]
let userList = []
let userIdx = 0
let userCount = 0
//---------------------- 自定义变量区域 -----------------------------------      // 4. 要杀变量自己加

let app_id = 14
let text = sign = ''
//---------------------------------------------------------

async function start() {    // 5. 开始任务区域   自己按照格式加


	console.log('\n================== 用户信息 ==================\n')
	taskall = []
	for (let user of userList) {
		taskall.push(user.user_info('用户信息'))
	}
	await Promise.all(taskall)

	console.log('\n================== 任务列表 ==================\n')
	taskall = []
	for (let user of userList) {
		taskall.push(user.task_list('任务列表'))
	}
	await Promise.all(taskall)



}

// 6. 一整个class   就是完整的任务 
class UserInfo {
	constructor(str) { 			// 7. 构造函数  处理变量等    用 this 挂在对象上
		this.index = ++userIdx
		this.ck = str.split('&')
		this.xs = this.ck[0]
		this.xr = this.ck[1]
		this.salt = 'FR*r!isE5W'
		this.id = app_id
		this.ts = utils.ts13()
	}


	// 8. 每个函数实现一个功能
	async signin(name) { //签到                     
		let path = '/api/user_mumber/sign'
		let sign = this.get_sign(path)

		let options = {   //9. 就是组成请求的数据
			method: "Get",
			url: `https://vapp.tmuyun.com${path}`,             // 9. url
			headers: { 										// 9. headers
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
			},
		}

		// console.log(options);
		let result = await httpRequest(name, options)  // 10. 请求返回 result

		// console.log(result);
		if (result.code == 0) {     // 11. 返回 result判断  
			DoubleLog(`账号[${this.index}]  ${name}" ${result.data.reason}, 获得积分 ${result.data.signIntegral}`)
			await utils.wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)




	}


	async user_info(name) { // 用户信息
		let path = '/api/user_mumber/account_detail'
		let sign = this.get_sign(path)

		let options = {
			method: "Get",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
			},
		}

		// console.log(options);
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${result.data.rst.nick_name}, 手机号: ${utils.phone_num(result.data.rst.mobile)}, 积分 ${result.data.rst.total_integral}, 等级 ${result.data.rst.grade} ${result.data.rst.grade_name}`)
			this.nickname = result.data.rst.nick_name

		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)




	}

	// 任务列表   completed 0 未完成	1 完成
	async task_list(name) {
		let path = '/api/user_mumber/numberCenter'
		let sign = this.get_sign(path)

		let options = {
			method: "Get",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
			},
		}

		// console.log(options);
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			let tasks = result.data.rst.user_task_list
			// console.log(tasks);
			for (const task of tasks) { // completed 0 未完成	1 完成
				this.task_name = task.name
				this.finish_times = task.finish_times
				this.frequency = task.frequency
				if (task.completed == 0) {
					if (task.id == 133) {	// 每日签到
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						await this.signin(this.task_name)
					}
					if (task.id == 134) { // 新闻资讯阅读
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						let num = this.frequency - this.finish_times
						for (let index = 0; index < num; index++) {
							await this.read(this.task_name)
						}
					}
					if (task.id == 135) { // 分享资讯给好友
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						let num = this.frequency - this.finish_times
						for (let index = 0; index < num; index++) {
							await this.share(this.task_name)
						}
					}
					if (task.id == 136) { // 新闻资讯评论
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						let num = this.frequency - this.finish_times
						for (let index = 0; index < num; index++) {
							await this.comment(this.task_name)
						}
					}
					if (task.id == 137) { // 新闻资讯点赞
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						let num = this.frequency - this.finish_times
						for (let index = 0; index < num; index++) {
							await this.like(this.task_name)
						}
					}
					if (task.id == 138) { // 使用本地服务
						DoubleLog(`账号 ${this.nickname} : ${this.task_name}----${this.finish_times}/${this.frequency}`)
						await this.local_srv(this.task_name)
					}

				} else DoubleLog(`${this.task_name}: 已完成`)
			}

		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}


	async artic(name) { // 获取文章
		let path = '/api/article/channel_list'
		let sign = this.get_sign(path)
		let a = utils.randomInt(1, 5)

		let options = {
			method: "Get",
			url: `https://vapp.tmuyun.com${path}?channel_id=5cc2ccbe1b011b18ee37591d&isDiFangHao=false&is_new=true&list_count=${a * 10}&size=10&start=${this.ts}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
			},
		}

		// console.log(options);
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name}, ok`)
			let p = utils.randomInt(0, 9)
			this.rid = result.data.article_list[p].id
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}

	async read(name) { // 新闻资讯阅读
		await this.artic('获取文章')

		let path = '/api/article/detail'
		let sign = this.get_sign(path)

		let options = {
			method: "Get",
			url: `https://vapp.tmuyun.com${path}?id=${this.rid}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
			},
		}
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name}, 文章ID${this.rid} ${result.data.article.list_title}`)
			await wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}

	async share(name) { // 分享资讯给好友
		await this.artic('获取文章')

		let path = '/api/user_mumber/doTask'
		let sign = this.get_sign(path)

		let options = {
			method: "POST",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
				"Content-Type": `application/x-www-form-urlencoded`,
			},
			form: {
				'memberType': '3',
				'member_type': '3'
			}
		}
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name} :文章ID ${this.rid}, ok}`)
			await wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}

	async comment(name) { // 新闻资讯评论
		await this.artic('获取文章')

		let path = '/api/comment/create'
		let sign = this.get_sign(path)

		let options = {
			method: "POST",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
				"Content-Type": `application/x-www-form-urlencoded`,
			},
			form: {
				'channel_article_id': this.rid,
				'content': 1
			}
		}
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name} :文章ID ${this.rid}, ok}`)
			await wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}

	async like(name) { // 新闻资讯点赞
		await this.artic('获取文章')

		let path = '/api/favorite/like'
		let sign = this.get_sign(path)

		let options = {
			method: "POST",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
				"Content-Type": `application/x-www-form-urlencoded`,
			},
			form: {
				'id': this.rid,
				'action': true
			}
		}
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name} :文章ID ${this.rid}, ok}`)
			await wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}

	async local_srv(name) { // 使用本地服务
		await this.artic('获取文章')

		let path = '/api/user_mumber/doTas'
		let sign = this.get_sign(path)

		let options = {
			method: "POST",
			url: `https://vapp.tmuyun.com${path}`,
			headers: {
				"X-SESSION-ID": this.xs,
				"X-REQUEST-ID": this.xr,
				"X-TIMESTAMP": this.ts,
				"X-SIGNATURE": sign,
				"Cache-Control": `no-cache`,
				"X-TENANT-ID": `14`,
				'Host': 'vapp.tmuyun.com',
				"Content-Type": `application/x-www-form-urlencoded`,
			},
			form: {
				'memberType': 6,
				'member_type': 6
			}
		}
		let result = await httpRequest(name, options)

		// console.log(result);
		if (result.code == 0) {
			DoubleLog(`账号[${this.index}]   ${name} : 成功 获得 ${result.data.score_notify.integral} 积分`)
			await wait(3)
		} else DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`), console.log(result)
	}



	get_sign(path) {
		let _data = `${path}&&${this.xs}&&${this.xr}&&${this.ts}&&${this.salt}&&${this.id}`
		// console.log('_data: ', _data);
		sign = utils.SHA256_Encrypt(_data)
		return sign
	}




}

!(async () => {
	if (!(await checkEnv())) return
	if (userList.length > 0) {
		await start()
	}
	await SendMsg(msg)
})()
	.catch((e) => console.log(e))
	.finally(() => $.done())



// 下面的不用管了   全默认就行   记得装 yml2213-utils 依赖
// #region ********************************************************  固定代码  ********************************************************


// 变量检查与处理
async function checkEnv() {
	if (userCookie) {
		// console.log(userCookie);
		let e = envSplitor[0]
		for (let o of envSplitor)
			if (userCookie.indexOf(o) > -1) {
				e = o
				break
			}
		for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n))
		userCount = userList.length
	} else {
		console.log("未找到CK")
		return
	}
	return console.log(`共找到${userCount}个账号`), !0
}



// =========================================== 不懂不要动 =========================================================
function Env(name, e) { class s { constructor(name) { this.env = name } } return new (class { constructor(name) { (this.name = name), (this.logs = []), (this.startTime = new Date().getTime()), this.log(`\n🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } log(...name) { name.length > 0 && (this.logs = [...this.logs, ...name]), console.log(name.join(this.logSeparator)) } done() { const e = new Date().getTime(), s = (e - this.startTime) / 1e3; this.log(`\n🔔${this.name}, 结束! 🕛 ${s} 秒`) } })(name, e) } async function httpRequest(name, options) { if (!name) { name = /function\s*(\w*)/i.exec(arguments.callee.toString())[1] } try { let result = await utils.httpRequest(name, options); if (result) { return result } { DoubleLog(`未知错误(1)`) } } catch (error) { console.log(error) } } async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("../sendNotify"); await notify.sendNotify($.name, message) } else { console.log($.name, "", message) } } else { console.log(message) } } function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000) }) } function DoubleLog(data) { console.log(`    ${data}`); msg += `\n    ${data}` }

