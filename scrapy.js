const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/Users/luwei/Downloads/chrome-mac/Chromium.app/Contents/MacOS/Chromium',//把项目中的这个chrome-win文件夹放到D盘根目录
        headless: false //这个是 是否打开chrome可视化窗口 true是不打开 false是打开
    })

    const page = await browser.newPage();
    await page.goto('https://www.toutiao.com/ch/news_game/');

    //定义页面内容及Jquery
    var content, $

    /* 页面滚动方法 */
    async function scrollPage(i) {
        content = await page.content();
        $ = cheerio.load(content);
        /*执行js代码（滚动页面）*/
        await page.evaluate(function (i) {
            console.log(i);
            /* 这里做的是渐进滚动，如果一次性滚动则不会触发获取新数据的监听 */
            for (var y = 0; y <= 1000 * i; y += 100) {
                window.scrollTo(0, y)
            }
        }, i)
        // 获取数据列表
        const li = $($('.feedBox').find('ul')[0]).find('li')
        return li
    }

    let i = 0
    let li = await scrollPage(++i)
    //如果数据列表 不够30 则一直获取
    while (li.length < 50) {
        li = await scrollPage(++i)
    }
    let data = {
        list: []
    }
    /* 封装返回的数据*/
    li.map(function (index, item) {
        $(item).find('a').attr('href') != undefined ?
            data.list.push({
                href: $(item).find('a').attr('href'),
            }) : ''
    })

    console.log(data.list);

    /* 关闭 puppeteer*/
    await browser.close()
})();
