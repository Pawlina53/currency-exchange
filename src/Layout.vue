<script>
import DropDown from './components/DropDown.vue';
import ChartData from './components/ChartData.vue';
import 'currency-flags/dist/currency-flags.css';
import { getCurrentCurrencies } from './utils/utils';
import WebsocketManager from './components/WebsocketManager.vue';
import AnimateNumber from './components/AnimateNumber.vue';
import currencySymbols from "vue-currency-symbol/src/countries.json";
import ThemeMode from './components/ThemeMode.vue';

export default {
  data() {
    return {
      originalArray: [],
      currencyOneValue: {code: 'EUR', currency: 'Euro'},
      currencyTwoValue: {code: 'USD', currency: 'US Dollar'},
      currencyArrayOne: [],
      currencyArrayTwo: [],
      comparedCurrences: '',
      currentCurrencyValue: 0,
      currencyDif: 0,
      currencyDifPercentage: 0,
      isCurrencyDifNegative: false,
      average: 0,
      currencySymbol: ''
    }
  },
  components: {
    "DropDown": DropDown,
    "Chart": ChartData,
    "WebsocketManager": WebsocketManager,
    "AnimateNumber": AnimateNumber,
    "ThemeMode": ThemeMode
},
  async mounted() {
    const data = await getCurrentCurrencies()
    const listOfCurrencies = Object.entries(data.data.available_currencies);
    
    listOfCurrencies.forEach((currency) => {
      let currencyDetail = {
        code: currency[0],
        currency: currency[1],
      };
      this.originalArray.push(currencyDetail);
    })
    this.currencyArrayOne = this.originalArray;
    this.currencyArrayTwo = this.originalArray;
    
    this.comparedCurrences = `${this.currencyOneValue.code}${this.currencyTwoValue.code}`;
    this.updateCurrencyList();
  },
  methods: {
    updateCurrencyValue(currencyValue) {
      this.currentCurrencyValue = currencyValue.toFixed(6);
      this.updateAverage();
    },
    selectFirstCurrency(payload) {
      this.currencyOneValue = payload;
      this.comparedCurrences = `${this.currencyOneValue.code}${this.currencyTwoValue.code}`
      this.updateCurrencyList();
    },
    selectSecondCurrency(payload) {
      this.currencyTwoValue = payload;
      this.comparedCurrences = `${this.currencyOneValue.code}${this.currencyTwoValue.code}`
      this.updateCurrencyList();
    },
    updateCurrencyList() {
      if(this.currencyTwoValue && this.currencyOneValue){
        const selectedCurrency = currencySymbols.filter((curr) => curr.abbreviation === this.currencyTwoValue.code);
        this.currencySymbol = selectedCurrency[0].symbol;
        let newArray = [...this.originalArray];
        //if option is selected in first dropdown, remove from the second dropdown
        newArray = newArray.filter((item) => (item.currency !== this.currencyTwoValue.currency && item.currency !== this.currencyOneValue.currency));
        this.currencyArrayOne = newArray;
        this.currencyArrayTwo = newArray;
      }
    },
    async updateAverage(totalItems, totalAmount){
      //calculate average,
      //check if average is higher than current converted value
      //calculate percentage 
      if(totalItems && totalAmount){
        this.average = totalAmount/totalItems;
      }
      if(this.currencyOneValue && this.currencyTwoValue){
        //use Math.abs to convert to positive number
        this.currencyDif = (this.currentCurrencyValue - this.average).toFixed(6);
        this.isCurrencyDifNegative = this.currencyDif > 0 ? false : true;
        const value = ((100 * this.currencyDif) / this.currentCurrencyValue).toFixed(6);
        this.currencyDifPercentage = Math.abs(value) === Infinity ? 0 : value
      }
    }
  }
}
</script>

<template>
  <WebsocketManager
    :currency="comparedCurrences"
    v-on:updateCurrency="updateCurrencyValue" 
  />
  <div class="header-container">
    <h1 class="header-title">Forex Exchange</h1>
    <span class="header-description">Check out the current price for a currency pair</span>
    <ThemeMode/>
  </div>
  <div class="content-container">
    <div class="dropdown-container">
      <DropDown class="my-dropdown-toggle"
        :options="currencyArrayOne" 
        :selected="currencyOneValue" 
        v-on:updateOption="selectFirstCurrency" 
        :placeholder="'Select an Item'"
        :closeOnOutsideClick="true">
      </DropDown>
      
      <DropDown class="my-dropdown-toggle"
        :options="currencyArrayTwo" 
        :selected="currencyTwoValue" 
        v-on:updateOption="selectSecondCurrency" 
        :placeholder="'Select an Item'"
        :closeOnOutsideClick="true">
      </DropDown>
    </div>
    <div class="details-container">
      <div class="flag-container">
        <div :class="['currency-flag currency-flag-'+currencyOneValue?.code?.toLowerCase()]"></div>
        <div :class="['currency-flag currency-flag-'+currencyTwoValue?.code?.toLowerCase()]"></div>
        <a href="https://www.forex.com/ie/" target="_blank" class="forex-link">Forex.com</a>
      </div>
      <div class="currency-container">
        
        <div class="currency-info">
          <h1 class="currency-codes">{{ currencyOneValue?.code }}/{{ currencyTwoValue?.code }}</h1>
          <div class="currency-value">
            <span v-html="currencySymbol" style="margin-right: 5px;"></span>
            <span>
              <AnimateNumber
                :number="Number(currentCurrencyValue)"
              />
            </span>
          </div>
          
        </div>
        <span :class="['caret ', {'negative': isCurrencyDifNegative}]"></span>
        <span :class="['currency-percentage ' , {'negative': isCurrencyDifNegative}]">
          <AnimateNumber
            :number="Math.abs(currencyDif)"
          />
          (<AnimateNumber
            :number="Math.abs(currencyDifPercentage)"
          />%)
        </span>
      </div>
      <Chart
        :currency="comparedCurrences"
        v-on:updateAverage="updateAverage" 
      />
    </div>
  </div>
  
</template>

<style scoped lang="scss">
.header-container{
  position: relative;
}
.header-title{
  transition: all 200ms ease-in-out;
  margin: 0;
  color: var(--text-primary-color);
  margin-bottom: 0.5rem;
  font-weight: 800;
}

.header-description{
  transition: all 200ms ease-in-out;
  color: var(--text-secondary-color);
  font-size: 1rem;  
  font-weight: 800;
}

.currency-container{
  padding: 0 2rem;
  position: relative;
}

.flag-container{
  padding: 0 2rem;
  margin-top: 1.6rem;
  display: flex;
}

.forex-link{
  transition: all 200ms ease-in-out;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: var(--background-color-secondary);
  border-radius: 62px;
  color: var(--text-secondary-color);
  font-weight: 800;
  cursor: pointer;
}

.content-container{
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  gap: 2.5rem;
}

.caret {
  position: absolute;
  bottom: 8px;
  vertical-align: middle;
  right: 21px;
  border-top: 4px dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  color: green;
  rotate: 180deg;

    &.negative{
      rotate: 0deg;
      color: red;
    }
}

.dropdown-container{
  margin: auto;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 25%
}

.details-container{
  transition: all 200ms ease-in-out;
  background-color: var(--background-color-primary);
  margin: auto;
  margin-right: 0;
  padding: 0.4rem;
  border-radius: 0.75rem;
  box-shadow: 0px 9px 10px 0px var(--box-shadow-primary-color);    
  max-width: 75%;
  width: 100%;
}

.currency-info{
  margin-top: 0.3rem;
  display: flex;
}

.currency-codes{
  transition: all 200ms ease-in-out;
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary-color);
  font-weight: 800;
  line-height:normal;
}

.currency-value{
  transition: all 200ms ease-in-out;
  margin: auto;
  margin-right: 0;
  color: var(--text-primary-color);
  font-size: 1.75rem;
}

.currency-percentage{
  display: flex;
  justify-content: flex-end;
  font-weight: 700;
  color: green;

    &.negative{
      color: red;
    }
}

.currency-flag{
  width: 40px;
  height: 40px;
  background-position-x: center;
  border-radius: 50%;
  margin-right: 0.75rem;
}

/* for sm */
@media only screen and (max-width: 600px){
  .header-title{
    max-width: 50%;
  }
}

/* for md */
@media only screen and (max-width: 900px){
  .header-title{
    font-size: 2.5rem;
  }
  .dropdown-container{
    gap:1rem;
    max-width: 400px;
  }
  .content-container{
    flex-direction: column;
  }

  .details-container{
    max-width: calc(100% - 1rem);
    margin: auto;
    /* width: fit-content; */
  }

  .flag-container{
    margin-top: 0.8rem;
    padding: 0 0.5rem;
  }

  .currency-container{
    padding: 0 0.5rem;
  }

  .currency-flag{
    width: 30px;
    height: 30px;
    margin-right: 0.5rem;
  }

  .currency-codes, .currency-value{
    font-size: 1.25rem;
  }

  .caret{
    right: 0;
  }
}
</style>
