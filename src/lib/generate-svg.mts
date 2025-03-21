// JSDOM をセットアップ
import CalHeatmap from 'cal-heatmap';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import puppeteer from 'puppeteer';

async function main() {
  const { window } = await new JSDOM('<!DOCTYPE html><html><body><div id="cal-heatmap""></div></body></html>');
  globalThis.document = window.document;

  // Cal-Heatmap 作成
  const cal = await new CalHeatmap();

  type data = {
    date: string;
    commits: number;
  };

  const heatmapData = async () => {
    // ダミーデータ生成（過去1年分の日付とランダム値）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const data: data[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear() + 1;
      const month = String(d.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
      const day = String(d.getDate()).padStart(2, '0');

      data.push({
        date: `${year}-${month}-${day}`,
        commits: Math.floor(Math.random() * 10)
      });
    }

    return data;
  };

  const options = {
    itemSelector: '#cal-heatmap',
    domain: {
      type: 'month',
      gutter: 4
    },
    subDomain: {
      type: 'ghDay',
      gutter: 2
    },
    data: {
      source: await heatmapData(),
      x: 'date',
      y: 'commits'
    },
    scale: {
      color: {
        type: 'threshold',
        range: ['#ffffff', '#d6ffd6', '#b7ffb7', '#7fff7f	'],
        domain: [0, 1, 5, 10]
      }
    }
  };

  await cal.paint({ ...options });

  // 出力ファイル名
  const outputPath1 = await path.join('.', 'docs', 'heatmap1.svg');
  const outputPath2 = path.join('.', 'docs', 'heatmap2.png');

  // 方法1. simple SVG
  const heatmapHtml = window.document.body.querySelector('#cal-heatmap')!;
  const css = await fetch('https://unpkg.com/cal-heatmap/dist/cal-heatmap.css').then((res) => res.text());
  const styleTag = window.document.createElement('style');
  styleTag.textContent = css;

  heatmapHtml.querySelector('.ch-container')!.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  heatmapHtml.querySelector('.ch-container')!.appendChild(styleTag);

  await fs.writeFileSync(outputPath1, heatmapHtml.innerHTML);

  // 方法2. Puppeteer を使用してスクリーンショットを取得
  // use before: pnpm exec puppeteer browsers install chrome
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(window.document.body.innerHTML);
  await page.addStyleTag({
    url: 'https://unpkg.com/cal-heatmap/dist/cal-heatmap.css'
  });

  const heatmap = await page.$('#cal-heatmap');
  await heatmap!.screenshot({ path: outputPath2, fullPage: false });

  await browser.close();

  console.log(`SVG saved to ${outputPath1}, ${outputPath2}`);
}

main();
