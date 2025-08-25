const CryptoJS = require('crypto-js');
const axios = require('axios');
const crypto = require('crypto');
const { Parser } = require('m3u8-parser');
const fs = require('fs');

// const targetUrl = ["https://v.qq.com/x/cover/mzc0020027yzd9e/y410108yxym.html"];
const targetUrl = ['https://v.qq.com/x/cover/mzc0020027yzd9e/h4101ir28id.html'];

// {
// 	t: "CT|ZheJiang_HangZhou-60.176.64.169",
// 	mrc: "3",
// 	z: "baiducdn_ct",
// 	time: "1755973601",
// 	v: "2025-08-01 v25.30.1",
// 	l: "https://bdcdnct.inter.71edge.com/v.f4v?uuid=3cb040a9-198d82ec9c0-0a4b5d77&src=iqiyi.com&cphc=arta",
// 	direct_h2c: "1",
// };
const fetchParamFromIqy = async () => {
    const res = await axios.get('https://data.video.iqiyi.com/v.f4v', {
        headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            origin: 'https://jx.xmflv.com',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            Referrer: 'https://jx.xmflv.com',
        },
    });
    return res.data;
};

const handleWap = targetUrl => {
    // iPad|iPhone|Android|Linux|iPod 用1
    const searchParam = new URLSearchParams(targetUrl);
    return searchParam.get('wap') ? 1 : 0;
};
const sign = md5 => {
    const b = CryptoJS.MD5(md5);
    const c = CryptoJS.enc.Utf8.parse(b);
    const d = CryptoJS.enc.Utf8.parse('https://t.me/xmflv666');
    const e = CryptoJS.AES.encrypt(md5, c, {
        iv: d,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    });
    return e.toString();
};

const genKey = (iqyTime, targetUrl) => {
    // hex_md5
    const md5 = crypto
        .createHash('md5')
        .update(iqyTime + targetUrl)
        .digest('hex');
    const res = sign(md5);
    return res;
};

const decrypt = (p1, key, iv) => {
    const res = CryptoJS['AES']['decrypt'](p1, CryptoJS['enc']['Utf8']['parse'](key), {
        iv: CryptoJS['enc']['Utf8']['parse'](iv),
        mode: CryptoJS['mode']['CBC'],
        padding: CryptoJS['pad']['Pkcs7'],
    });
    return res['toString'](CryptoJS['enc']['Utf8']);
};

const parseApi = async (targetUrl, iqyTime, iqyArea) => {
    const encodeUrl = encodeURIComponent(targetUrl);
    const requestParam = {
        wap: handleWap(targetUrl),
        url: encodeUrl,
        time: iqyTime,
        key: genKey(iqyTime, encodeUrl),
        area: iqyArea,
    };
    const res = await axios.post('https://202.189.8.170/Api.js', requestParam, {
        headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://jx.xmflv.com',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        },
    });

    return res.data;
};
const parseM3U8 = m3u8Content => {
    const parser = new Parser();
    parser.push(m3u8Content);
    parser.end();

    return parser.manifest;
};

const fetchM3u8 = async url => {
    const res = await axios.get(url, {
        headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            origin: 'https://jx.xmflv.com',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            Referrer: 'https://jx.xmflv.com',
        },
    });
    console.log('res', res.data);

    return res.data;
};
const downLoadTs = async (uri, name) => {
    const res = await axios.get(uri, {
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            origin: 'https://jx.xmflv.com',
            pragma: 'no-cache',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
        },
    });

    const tsContent = res.data;
    fs.writeFileSync(`./segements/${name}.ts`, tsContent);
};
const main = async () => {
    const iqyRes = await fetchParamFromIqy();
    const parseRes = await parseApi(targetUrl[0], iqyRes.time, iqyRes.t);
    console.log(parseRes);
    const url = decrypt(parseRes.url, parseRes.aes_key, parseRes.aes_iv);
    console.log('url', url);
    const m3u8Content = await fetchM3u8(url);
    console.log('m3u8Content', m3u8Content);

    const tsList = parseM3U8(m3u8Content);
    console.log('tsList', tsList);
    console.log('all num:', tsList.segments.length);
    for (let i = 0; i < tsList.segments.length; i++) {
        const segment = tsList.segments[i];
        fs.appendFileSync('./file_2.txt', `file '${i}.ts'\r\n`);
        downLoadTs(segment.uri, i);
    }

    // await downLoadTs(
    // 	"https://cdn.ryplay12.com/20250823/21268_4fe86060/2000k/hls/1c20fbfb72bfaf73f338ba4f1115fbab.ts"
    // );
};

main();
