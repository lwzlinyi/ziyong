/**
 * 作者:AX
 * ========= 青龙--配置文件 ===========
 * 项目名称:安心记加班
 * 变量名  axj 账号1Au&tk@账号2Au&tk
 * 抓Authorization 扭蛋抽奖需开抓包抽奖然后body里的deviceToken
 * 一天运行三次 cron 10 6,15,19 * * *
 * 2023/1/21 完善转盘抽奖 扭蛋抽奖
 * 多账号用 换行 或 @ 分割
 * ====================================
 *   
 */



const $ = new Env("安心记");
const ckName = "axj";
let show = "金币兑换现金"
//-------------------- 一般不动变量区域 -------------------------------------
//const utils = require("./utils");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1;		 //0为关闭通知,1为打开通知,默认为1
let debug = 0;           //Debug调试   0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';       //let ck,msg
let host, hostname;
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata()) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------- 自定义变量区域 -----------------------------------
//---------------------------------------------------------

async function start() {
    console.log(show)
    console.log('\n================== 查询金币 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.info_point('金币查询'));
        await wait(2);
    }
    await Promise.all(taskall);
    console.log('\n================== 每日签到 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_sign('每日签到'));
        await wait(2);
    }
    await Promise.all(taskall);
    console.log('\n================== 查询抽奖次数 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_cx('开始查询'));
        await wait(2);
    }
    await Promise.all(taskall);
    console.log('\n================== 查询扭蛋抽奖次数 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_ndcx('开始查询'));
        await wait(2);
    }
    await Promise.all(taskall);
    console.log('\n================== 运行后金币查询 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_a('开始查询'));
        await wait(2);
    }
    
        await Promise.all(taskall);
    
    }
class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.cktest = str.split('&')[0]; //单账号多变量分隔符
        this.cktest2 = str.split('&')[1];
        this.ck = "Bearer " + this.cktest.replace('Bearer', '')
        this.ck2 = this.cktest2;
        //let ck = str.split('&')
        //this.data1 = ck[0]
        //this.sign = this.ck1
        //this.userid = this.ck2
        this.headers={
            //'Content-Type': 'application/x-www-form-urlencoded',
            //Host: 'ymshapi.dmhw1688.com',
            //'User-Agent': 'okhttp/4.9.1',
            'content-type': 'application/json',
            'User-Agent':'PostmanRuntime-ApipostRuntime/1.1.0',
            'Cache-Control':'no-cache',
            'content-type':'application/json',
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'Authorization': this.ck,
            //body: 'merchantId=20&appType=1&appId=28&sign=this.ck1&devVersion=1.4.5&userId=this.ck2'
        }

    }

    async info_point(name) { // 金币查询
        try {
            let options = {
                method: "GET",
                url: `https://market-gateway.julanling.com/activity-third-account/api/cash/draw/drawIndex?os=ANDROID&appVersion=6.9.20&appChannel=unknow`,
                headers:  {'Authorization': this.ck},
                //body: `{"os":"ANDROID","appVersion":"6.9.20","appChannel":"vivo","deviceToken":"4e978751b3e56331d11bf8f6a0ff95fd"}`,

            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == 0) {
                DoubleLog(`账号[${this.index}]  金币: ${result.results.balanceAmount}`);
            } else {
                DoubleLog(`账号[${this.index}]  金币查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    
    }
 async task_sign(name) { // 执行签到
        try {
            let options = {
                method: 'POST',
                url: 'https://market-gateway.julanling.com/market-center/api2/signIn/signIn',
                headers: this.headers,
                body: '{"os":"ANDROID","appVersion":"6.9.20","appChannel":"vivo","deviceToken":"4e978751b3e56331d11bf8f6a0ff95fd"}',
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == "0") {
                DoubleLog(`账号[${this.index}]  签到: ${result.results.amount}`);
            } else {
                DoubleLog(`账号[${this.index}]  签到:失败 ❌ 了呢,原因未知!` + result.errorStr);
                //console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async task_cx(name) { // 抽奖查询
        try {
            let options = {
                method: 'Get',
                url: 'https://market-gateway.julanling.com/market-center/api2/dial/detailCore?appChannel=vivo&appVersion=6.9.20&operatingSystem=ANDROID&os=ANDROID',
                headers: {'Authorization': this.ck},
                //body: '{"os":"ANDROID","appVersion":"6.9.20","appChannel":"vivo","deviceToken":"4e978751b3e56331d11bf8f6a0ff95fd"}',
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == 0) {
                DoubleLog(`账号[${this.index}]  开始查询: ${result.results.dialValidNum}`);
                let dialValidNum = parseInt(result.results.dialValidNum)
            if (dialValidNum > 0) {
                console.log("判断当前可抽奖" + dialValidNum + "次,开始抽奖");
                for (let i = 0; i < dialValidNum; i++) {
                    await this.task_cj("抽奖");
                    
                    await wait(6);
                    //await this.task_lq("领取");
                }
                }
            } else {
                DoubleLog(`账号[${this.index}]  查询失败 ❌ 了呢,原因未知!` + result.errorStr);
                //console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async task_cj(name) { // 执行抽奖
        try {
            let options = {
                method: 'POST',
                url: 'https://market-gateway.julanling.com/market-center/api2/dial/luckyDraw',
                headers: this.headers,
                body: '{"appChannel":"vivo","appVersion":"6.9.20","operatingSystem":"ANDROID","os":"ANDROID"}',
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            
            //await (i);
            //this.bizNo = i;
            //console.log(result);
            if (result.errorCode == "0") {
               DoubleLog(`账号[${this.index}]  抽奖获得: ${result.results.amount} 领奖编号${result.results.bizNo}`);

                let i = result.results.bizNo;
                this.body=`{"bizNo":"${i}","appChannel":"vivo","appVersion":"6.9.20","operatingSystem":"ANDROID","os":"ANDROID"}`
                //console.log(i);
                //await i (result.results.bizNo);
                //let bizNo = DoubleLog (result.results.bizNo);
            } else {
                DoubleLog(`账号[${this.index}]  抽奖失败 ❌ 了呢,原因未知!` + result.errorStr);
                //console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
        
        let options = {
            method: 'POST',
            url: 'https://market-gateway.julanling.com/market-center/api2/dial/receiveDialCoin',
            headers: this.headers,
            //body: `{"bizNo":"${this.bizNo}","appChannel":"vivo","appVersion":"6.9.20","operatingSystem":"ANDROID","os":"ANDROID"}`,
            body:this.body,
        };
        //console.log(options);
        let result = await httpRequest(options, name);
        //console.log(result);
        if (result.errorCode == "0") {
            DoubleLog(`账号[${this.index}]  领取: ${result.results.amount}`);
        } else {
            DoubleLog(`账号[${this.index}]  领取失败 ❌ 了呢,原因未知!` + result.errorStr);
            //console.log(result);
        }
    } catch (error) {
        console.log(error);
    }
    
       
    /*async task_lq(name) { // 抽奖奖励领取
        
        
        try {
            let options = {
                method: 'POST',
                url: 'https://market-gateway.julanling.com/market-center/api2/dial/receiveDialCoin',
                headers: this.headers,
                //body: `{"bizNo":"${this.bizNo}","appChannel":"vivo","appVersion":"6.9.20","operatingSystem":"ANDROID","os":"ANDROID"}`,
                body:this.body,
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == "0") {
                DoubleLog(`账号[${this.index}]  领取: ${result.results.amount}`);
            } else {
                DoubleLog(`账号[${this.index}]  领取失败 ❌ 了呢,原因未知!` + result.errorStr);
                //console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }*/

    async task_ndcx(name) { // 扭蛋次数查询
        try {
            let options = {
                method: "post",
                url: `https://market-gateway.julanling.com/market-center/api2/gacha/luckyDraw`,
                headers: this.headers,
                body: `{"deviceToken":"${this.ck2}","version":"6.9.20","os":"ANDROID","appVersion":"6.9.20","appChannel":"unknow"}`,

            };
            //console.log(options);
            let result = await httpRequest(options, name);
            if (result.errorCode == 0) {
                DoubleLog(`账号[${this.index}]  开始查询: ${result.results.remainTimes}`);
                let remainTimes = parseInt(result.results.remainTimes)
            if (remainTimes > 0) {
                console.log("判断当前可抽奖" + remainTimes + "次,开始抽奖");
                for (let i = 0; i < remainTimes; i++) {
                    await this.task_ndcj("抽奖");
                    await wait(6);
                }
            }
        }
                
            //console.log(result);
            if (result.result == 1) {
                DoubleLog(`账号[${this.index}]  查询: ${result.data.remainTimes}`);
            } else {
                DoubleLog(`账号[${this.index}]  查询失败 ❌ 了呢,原因`+ result.errorStr);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    
    }
 async task_ndcj(name) { // 扭蛋抽奖
        try {
            let options = {
                method: 'POST',
                url: 'https://market-gateway.julanling.com/market-center/api2/gacha/luckyDraw',
                headers: this.headers,
                body: `{"deviceToken":"${this.ck2}","version":"6.9.20","os":"ANDROID","appVersion":"6.9.20","appChannel":"unknow"}`,
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == 0) {
                DoubleLog(`账号[${this.index}]  抽奖获得: ${result.results.name}`);
            } else {
                DoubleLog(`账号[${this.index}]  抽奖失败 ❌ 了呢,原因` + result.errorStr);
                //console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async task_a(name) { // 运行后金币查询
        try {
            let options = {
                method: "GET",
                url: `https://market-gateway.julanling.com/activity-third-account/api/cash/draw/drawIndex?os=ANDROID&appVersion=6.9.20&appChannel=unknow`,
                headers:  {'Authorization': this.ck},
                //body: `{"os":"ANDROID","appVersion":"6.9.20","appChannel":"vivo","deviceToken":"4e978751b3e56331d11bf8f6a0ff95fd"}`,

            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.errorCode == 0) {
                DoubleLog(`账号[${this.index}]  运行后金币查询: ${result.results.balanceAmount}`);
            } else {
                DoubleLog(`账号[${this.index}]  金币查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    
    }


}

!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());


// #region ********************************************************  固定代码  ********************************************************

// 变量检查与处理
async function checkEnv() {
    if (userCookie) {
        // console.log(userCookie);
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userCount}个账号`), true;//true == !0
}
// =========================================== 不懂不要动 =========================================================
// 网络请求 (get, post等)
async function httpRequest(options, name) { var request = require("request"); return new Promise((resolve) => { if (!name) { let tmp = arguments.callee.toString(); let re = /function\s*(\w*)/i; let matches = re.exec(tmp); name = matches[1] } if (debug) { console.log(`\n【debug】===============这是${name}请求信息===============`); console.log(options) } request(options, function (error, response) { if (error) throw new Error(error); let data = response.body; try { if (debug) { console.log(`\n\n【debug】===============这是${name}返回数据==============`); console.log(data) } if (typeof data == "string") { if (isJsonString(data)) { let result = JSON.parse(data); if (debug) { console.log(`\n【debug】=============这是${name}json解析后数据============`); console.log(result) } resolve(result) } else { let result = data; resolve(result) } function isJsonString(str) { if (typeof str == "string") { try { if (typeof JSON.parse(str) == "object") { return true } } catch (e) { return false } } return false } } else { let result = data; resolve(result) } } catch (e) { console.log(error, response); console.log(`\n ${name}失败了!请稍后尝试!!`) } finally { resolve() } }) }) }
// 等待 X 秒
function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000) }) }
// 双平台log输出
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `\n${data}` } } else { console.log(`${data}`); msg += `\n${data}` } }
// 发送消息
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
