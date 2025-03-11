import CalHeatmap from 'cal-heatmap';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

const cal = new CalHeatmap();
cal.paint({
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
  }
});
