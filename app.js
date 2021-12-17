const puppeteer = require('puppeteer');

const fundcode = process.argv[2];

if (!fundcode) {
  console.warn('Fundcode is required.');
  console.log('ex. node app BM70SSF');
  return;
}

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://codequiz.azurewebsites.net/');

  await page.evaluate(() => {
    document.getElementsByTagName('input')[0].click();
  });

  const tableSelector = 'table';
  await page.waitForSelector(tableSelector);

  const fundsNav = await page.evaluate(() => {
    const rows = document.getElementsByTagName('tr');
    return Array.from(rows).map(row => {
      const childs = Array.from(row.children);
      return {
        code: childs[0].innerHTML,
        nav: childs[1].innerHTML
      }
    });
  });

  const result = fundsNav.find(s => s.code === fundcode);
  console.log(result ? result.nav : 'Not found.');

  await browser.close();
})();