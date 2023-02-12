
<script>
import Chart from 'chart.js/auto';
import response from '../dummyData.json';
import { get15MinutesDataset, getHourDataset, getDayDataset, getWeekDataset, getMonthDataset } from '../utils/utils';

export default {
    data() {
        return {
            chart: null,
            durations: ['15M', '1H', '1D', '1W', '1M'],
            durationSelected: '15M',
            durationDisabled: true,
        }
    },
    props:{
        currency: [String],
    },
    emits: ["updateAverage"],
    mounted() {
        this.handleChartDataSet('15M');
    },
    watch: {
        currency:{ 
            handler :'handleChartDataSet',
        }
    },
    methods: {
        async handleChartDataSet(duration) {
            //disable buttons until animation is ready
            this.durationDisabled = true;
            if(this.chart) this.chart.destroy();
            this.chart = null;
            this.durations.includes(duration) && (this.durationSelected = duration);
            const {labels, points} = await this.generateDataset();
            if(this.currency && !this.chart){
                this.chart = new Chart(document.getElementById("line-chart"), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{ 
                            data: points,
                            label: this.currency,
                            borderColor: "#87bf3a",
                            fill: true,
                            backgroundColor: "rgba(230, 248, 218, 0.5)",
                            borderJoinStyle: 'miter',
                            drawActiveElementsOnTop: false,
                            pointHoverRadius: 5,
                            pointRadius: 0,
                        }
                        ]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                        },
                        title: {
                            display: false,
                        },
                        scales: {
                            x: {
                                display:false,
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                display:false,
                                grid: {
                                    display: false
                                }
                            }
                        },
                        animation: {
                            onComplete: () => {
                                this.durationDisabled = false;
                            }
                        },
                        responsive: true
                    }
                });    
            }
        },
        async generateDataset() {
            //make api call here to fetch data
            //FOR ONE WEEK AND 1 MONTH
            //https://marketdata.tradermade.com/api/v1/timeseries?currency=EURUSD&api_key=-_Sr1PfxLmxtJp1oVsDV&start_date=2019-10-01&end_date=2019-10-10&format=records
            // let dataSet = response[0].TIMESERIES_MINUTE_REQUEST.quotes;
            let dataSet = [];
            if(this.currency.length > 0){
                if(this.durationSelected === '15M'){
                    await get15MinutesDataset(this.currency)
                        .then((data) => {
                            dataSet = data.data.quotes
                            console.log("Chart Data for 15 minutes: ", dataSet)
                        })
                }
                if(this.durationSelected === '1H'){
                    await getHourDataset(this.currency)
                        .then((data) => {
                            dataSet = data.data.quotes
                            console.log("Chart Data for 1 hour: ", dataSet)
                        })
                }
                if(this.durationSelected === '1D'){
                    await getDayDataset(this.currency)
                        .then((data) => {
                            dataSet = data.data.quotes
                            console.log("Chart Data for 1 day: ", dataSet)
                        })
                }
                if(this.durationSelected === '1W'){
                    await getWeekDataset(this.currency)
                        .then((data) => {
                            dataSet = data.data.quotes
                            console.log("Chart Data for 1 week: ", dataSet)
                        })
                }
                if(this.durationSelected === '1M'){
                    await getMonthDataset(this.currency)
                        .then((data) => {
                            dataSet = data.data.quotes
                            console.log("Chart Data for 1 month: ", dataSet)
                        })
                }
            }

            let totalAmount = 0 ;
            dataSet.forEach((data) => totalAmount += data.close);
            let totalItems = dataSet.length;

            this.$emit('updateAverage', totalItems, totalAmount);
            
            let labels = [];
            let points = [];

            dataSet.forEach((quote) => {
                labels.push(quote.date);
                points.push(quote.close);
            })
            return {labels, points};
        },
    }
}
</script>

<template>
    <canvas id="line-chart" width="800" height="450"></canvas>
    <div class="duration-container">
        <button :class="[{'active' : this.durationSelected === duration}]" v-for="(duration, index) in durations" :key="index" :disabled="durationDisabled" @click="handleChartDataSet(duration)">
            {{ duration }}
        </button> 
    </div>
</template>

<style>
#line-chart{
    width: 100%;
    height: auto;
}

.duration-container{
    display: flex;
    justify-content: center;
    padding: 0.75rem 0;
    gap: 2rem;
    flex-flow: wrap;
}

button.active{
  transition: all 200ms ease-in-out;
  background: var(--active-primary-color);
  font-weight: 800;
}

@media only screen and (max-width: 900px){
    .duration-container{
        gap: 0.5rem;
    }
}
</style>