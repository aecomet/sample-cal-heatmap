import CalHeatmap from 'cal-heatmap';
import { createCanvas } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';

// JSDOM をセットアップ
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;
global.window = window;
global.HTMLElement = window.HTMLElement;
global.Node = window.Node;

(async () => {
  // キャンバスの作成
  const width = 800;
  const height = 200;
  const canvas = createCanvas(width, height);

  // Cal-Heatmap のインスタンス作成
  const cal = new CalHeatmap();

  // 設定
  await cal.paint({
    data: {
      source: async () => {
        // ダミーデータ生成（過去1年分の日付とランダム値）
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);

        const data: { [key: number]: number } = {};
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          data[Math.floor(d.getTime() / 1000)] = Math.floor(Math.random() * 10);
        }
        return data;
      },
      x: 'timestamp',
      y: 'value'
    },
    range: 12,
    scale: {
      color: {
        type: 'linear',
        scheme: 'Blues',
        domain: [0, 10]
      }
    },
    domain: {
      type: 'month',
      gutter: 4
    },
    subDomain: {
      type: 'day',
      radius: 2
    },
    itemSelector: canvas
  });

  // SVG を保存
  const outputPath = path.join(__dirname, 'docs', 'heatmap.svg');
  fs.writeFileSync(outputPath, canvas.toBuffer());

  console.log(`SVG saved to ${outputPath}`);
})();
