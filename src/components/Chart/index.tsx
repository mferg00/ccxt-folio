import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

type ChartProps = {
  prices: number[],
  dates: string[],
  breakeven?: number
}

const makeChartData = (prices: number[], dates: string[]) => {
  return {
    labels: dates,
    datasets: [
      {
        data: prices
      }
    ]
  }
}

const makeOptions = (prices: number[], breakeven?: number) => {
  const currentPrice = prices[prices.length - 1] 
  const maxPrice = Math.max.apply(null, prices)
  const colour = breakeven === undefined ? "gray" : ( breakeven < currentPrice ? "green" : "red" )

  return {
    title: {
      display:false
    },
    legend: {
      position: 'bottom',
      display:false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        backgroundColor: colour,
        borderColor: colour,
        fill: false,
        borderWidth: 2,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: { 
          display: false 
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks: { 
          display: false,
          suggestedMin: maxPrice / 1.1,
          suggestedMax: maxPrice * 1.1,
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    },
    ...(breakeven !== undefined) && {
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          drawTime: 'beforeDatasetsDraw',
          scaleID: 'y-axis-0',
          value: breakeven,
          borderColor: 'rgba(50, 50, 50, 0.5)',
          borderWidth: 1,
          borderDash: [6, 4],
          label: {
            enabled: false,
            content: 'Test label'
          }
        }]
      }
    }
  }
}

const Chart = (props: ChartProps) => {
  const { prices, dates, breakeven, ...rest } = props 
  
  return (
    <Line
      data={makeChartData(prices, dates)}
      width={1}
      height={1}
      options={makeOptions(prices, breakeven)}
      {...rest}
    />
  )
}

export default Chart