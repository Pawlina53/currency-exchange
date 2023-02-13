import axios from "axios";

export const API_KEY = 'FYZItEJinwCnDCwgu4rc';
export const STREAM_KEY = 'wslgcsyZ6C7TY9mvacAQ';

export const handleDateFormat = (date, includeTime=true) => {
    //calculate UTC timezone
    const difference = date.getTimezoneOffset();
    const utcDate = new Date(date.setMinutes(date.getMinutes() + difference));
    //returning date in YYYY-MM-DD-00:00 format
    const getYear = utcDate.toLocaleString("en-GB", {year: 'numeric'});
    const getMonth = utcDate.toLocaleString("en-GB", {month: '2-digit'});
    const getDay = utcDate.toLocaleString("en-GB", {day: '2-digit'});
    const getTime = utcDate.toTimeString().slice(0,5);
    if(includeTime) {
        return `${getYear}-${getMonth}-${getDay}-${getTime}`;
    }
    return `${getYear}-${getMonth}-${getDay}`;
}

export const get15MinutesDataset = async (currencies) => {
    const endDate = new Date();
    const startDate = new Date(new Date().setMinutes(new Date().getMinutes() - 15));
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencies}&api_key=${API_KEY}&start_date=${handleDateFormat(startDate)}&end_date=${handleDateFormat(endDate)}&format=records&interval=minute&period=1`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const getHourDataset = async (currencies) => {
    const endDate = new Date();
    const startDate = new Date(new Date().setMinutes(new Date().getMinutes() - 60));
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencies}&api_key=${API_KEY}&start_date=${handleDateFormat(startDate)}&end_date=${handleDateFormat(endDate)}&format=records&interval=minute&period=15`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const getDayDataset = async (currencies) => {
    const endDate = new Date();
    const startDate = new Date(new Date().setMinutes(new Date().getMinutes() - 1440));
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencies}&api_key=${API_KEY}&start_date=${handleDateFormat(startDate)}&end_date=${handleDateFormat(endDate)}&format=records&interval=hourly`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const getWeekDataset = async (currencies) => {
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencies}&api_key=${API_KEY}&start_date=${handleDateFormat(startDate, false)}&end_date=${handleDateFormat(endDate, false)}&format=records`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const getMonthDataset = async (currencies) => {
    const endDate = new Date();
    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/timeseries?currency=${currencies}&api_key=${API_KEY}&start_date=${handleDateFormat(startDate, false)}&end_date=${handleDateFormat(endDate, false)}&format=records`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const convertCurrencies = async (currencyFrom, currencyTo) => {
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/convert?api_key=${API_KEY}&from=${currencyFrom}&to=${currencyTo}&amount=1`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const getCurrentCurrencies = async () => {
    let data = null;
    await axios.get(`https://marketdata.tradermade.com/api/v1/live_currencies_list?api_key=${API_KEY}`)
        .then((response) => {
            data = response;
        }).catch((error) => {
            console.error("ERROR: ", error);
        })
    return data;
}

export const setTheme = (theme) => {
    document.documentElement.className = theme;
    return localStorage.setItem('theme-mode', theme)
}

export const getTheme = () => {
    return localStorage.getItem('theme-mode')
}