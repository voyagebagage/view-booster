// const initialize = require("./youtube");
// require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
// const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");
// const locateChrome = require("locate-chrome");

// const cors = require("cors");
// const yt = require("./youtube");

const app = express();
app.use(formidable());
// app.use(cors());
//----------------------------------------------------------------------------------------------------
//                                            XXXXXX
//----------------------------------------------------------------------------------------------------
const random = (maxSecondAdded) => {
  return Math.ceil(Math.random() * maxSecondAdded * 1000);
};
//----------------------------------------------------------------------------------------------------
//                                            XXXXXX
//----------------------------------------------------------------------------------------------------
const youtube = async (
  automationYoutubeUrl,
  username,
  password,
  maxSecondAdded
) => {
  // let page;
  // (async () => {
  // module.exports.run = async () => {
  // const browser = await puppeteer.launch({
  //     args: chromium.args,
  //     defaultViewport: chromium.defaultViewport,
  //     executablePath: await chromium.executablePath,
  //     headless: chromium.headless,
  //     ignoreHTTPSErrors: true,
  // });//
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./user_data2",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  //    const browser = await puppeteer.launch({
  //   // headless: false,
  //   // executablePath: await process.env.PUPPETEER_EXECUTABLE_PATH,
  //   args: ["--no-sandbox"],
  //   // args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // });
  const page = await browser.newPage();
  //if incognito
  // const context = await browser.createIncognitoBrowserContext();
  // const page = await context.newPage();
  await page.setDefaultNavigationTimeout(0); //
  await page.setDefaultTimeout(0);
  await page.goto(automationYoutubeUrl, {
    waitUntil: "load",
    timeout: 0,
  });
  //----------------------------------------------------------------------------------------------------
  //                                            XXXLOGIN--BUTTONXXX
  //-----------------------------------------------------------------------------------------------------
  // await page.waitForTimeout(1000);
  await page.waitForXPath(
    '//a//tp-yt-paper-button//yt-formatted-string[contains(text(),"Sign in")]'
  );
  let loginButton = await page.$x(
    '//a//tp-yt-paper-button//yt-formatted-string[contains(text(),"Sign in")]'
  );
  await loginButton[0].click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  // await page.waitForTimeout(1000);
  await page.waitForSelector('input[name="identifier"]');
  await page.type('input[name="identifier"]', username, { delay: 338 });
  // //----------------------------------------------------------------------------------------------------
  // //                                            XXXLOGINXXX
  // //-----------------------------------------------------------------------------------------------------
  let nextLoginButton = await page.$x(
    '//button//span[contains(text(),"Next")]'
  );
  await nextLoginButton[0].click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForTimeout(3500 + random(1));
  await page.waitForSelector('input[name="password"]');

  await page.type('input[name="password"]', password, { delay: 300 });

  // //----------------------------------------------------------------------------------------------------
  // //                                            XXXPASSWORDXXX
  // //-----------------------------------------------------------------------------------------------------
  let nextPasswordButton = await page.$x(
    '//button//span[contains(text(),"Next")]'
  );
  await page.waitForTimeout(1000 + random(0.3));

  await nextPasswordButton[0].click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  // await page.waitForTimeout(5000);

  //----------------------------------------------------------------------------------------------------
  //                                            XXX-SET-UP-XXX
  //-----------------------------------------------------------------------------------------------------
  //await for the play button to appear to continue
  await page.waitForXPath('//button[@title="Play (k)"]');
  let playButton = await page.$x('//button[@title="Play (k)"]');
  let loopPlaylistEnable = await page.$x(
    '//button[@aria-label="Loop playlist"]'
  );
  let muteButton = await page.$x('//button[@aria-label="Mute (m)"]');

  //click loop, mute and play
  await loopPlaylistEnable[0].click();
  await page.waitForTimeout(200 + random(0.5));
  await muteButton[0].click();
  await page.waitForTimeout(100 + random(0.5));

  await playButton[0].click();
  let nextButton = await page.$x('//a[@title="Next (SHIFT+n)"]');
  let i = 0;
  //----------------------------------------------------------------------------------------------------
  //                                            XXX-Play FOREVER-XXX
  //-----------------------------------------------------------------------------------------------------
  while (true) {
    i++; //
    await page.waitForTimeout(31000);
    let randomVideoTime = random(maxSecondAdded);
    console.log(randomVideoTime, i);
    await page.waitForTimeout(randomVideoTime);
    await nextButton[0].click();
    // if (stopButton) {
    //   break;
    // }
    // await page.waitForNavigation({ waitUntil: "networkidle2" });
  }
  browser.close();
  // })();
};
//----------------------------------------------------------------------------------------------------
//                                            XXXXXX
//----------------------------------------------------------------------------------------------------
app.get("/next-video", async (req, res) => {
  try {
    const { automationYoutubeUrl, username, password, maxSecondAdded } =
      req.query;

    res
      .status(200)
      .send(
        await youtube(automationYoutubeUrl, username, password, maxSecondAdded)
      );
    //--------------------------------------------------------------------------------------
    //                                            XXXXXX
    //--------------------------------------------------------------------------------------
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//ALL ROUTE & SERVER PORT\\\\\\\\_________________________\\\\\\\\\
app.all("*", (req, res) => {
  res.status(404).json({ error: "None existing route" });
});

app.listen(process.env.PORT || 4001, (req, res) => {
  console.log("Server Launched");
});
//----------------------------------------------------------------------------------------------------
//                                            XXXXXX
//----------------------------------------------------------------------------------------------------
