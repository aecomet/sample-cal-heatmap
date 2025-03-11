import CalHeatmap from 'cal-heatmap';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

const cal = new CalHeatmap();
cal.paint({
  range: 4,
  domain: { type: 'month' },
  subDomain: { type: 'day', label: 'DD' }
});
