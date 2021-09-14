const puppeteer = require("puppeteer");
const application = require("./downloader");
const channel =
  "https://www.youtube.com/c/RoyaltyFreeMusicNoCopyrightMusic/videos";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(channel);
  await page.evaluate((_) => {
    window.scrollBy(1, window.innerHeight);
  });

  let videoThumbnail = await page.$$("#items #dismissible");
  for (i = 1; i <= videoThumbnail.length; i++) {
    if (i == videoThumbnail.length) {
      page.evaluate((_) => {
        window.scrollBy(5, window.innerHeight);
      });
      await page.waitForTimeout(10000);
      videoThumbnail = await page.$$("#items #dismissible");
      console.log(videoThumbnail.length);
    }
    const videoTitle = await page.$$eval(
      `#items ytd-grid-video-renderer:nth-child(${i}) #dismissible #details #meta #video-title`,
      (nodes) => nodes.map((n) => n.href)
    );

    console.log(i);
    console.log(videoTitle);

    const download = await application.download(videoTitle);
  }
  //   await browser.close();
})();
