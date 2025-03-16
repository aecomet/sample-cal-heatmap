import CalHeatmap from 'cal-heatmap';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

const cal = new CalHeatmap();

type data = {
  date: string;
  commits: number;
};

const heatmapData = () => {
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
    source: heatmapData(),
    x: 'date',
    y: 'commits'
  },
  scale: {
    color: {
      type: 'threshold',
      range: ['#e6e6e6', '#d6ffd6', '#b7ffb7', '#7fff7f	'],
      domain: [0, 1, 5, 10]
    }
  }
};

console.log(options);
cal.paint({ ...options });
