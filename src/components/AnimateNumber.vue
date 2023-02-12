<template>
    {{ animatedNumber.toFixed(6) }}
</template>

<script>
  export default {
    data() {
        return{
            animatedNumber: 0,
            numberInterval: false,
        }
    },
    props: {
      number: [Number],
    },
    watch: {
        number:{ 
            handler :'handleAnimation',
        }
    },
    methods: {
        handleAnimation() {
            this.numberInterval && clearInterval(this.numberInterval)
            if(this.number === this.animatedNumber) return;

            this.numberInterval = setInterval(() => {
                let change = (this.number - this.animatedNumber) / 10;
                this.animatedNumber = this.animatedNumber + change;
            }, 20);
        }
    }
  }
  </script>