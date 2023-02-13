<script>
import { STREAM_KEY } from '../utils/utils';

export default {
  data() {
    return {
      connection: '',
      connected: false
    }
  },
  props:{
    currency: [String],
  },
  emits: ["updateCurrency"],
  watch: {
    currency:{ 
      handler :'handleCurrencyChange',
    }
  },
  methods: {
    handleCurrencyChange(){
      if(this.connected){
        this.connection.close();
        this.connected = false;
        const reconnect = setInterval(() => {
          this.createWebSocket();
          clearInterval(reconnect)
        }, 500)
      }
      
    },
    createWebSocket() {
      if(!this.connected){
        this.connection = new WebSocket("wss://marketdata.tradermade.com/feedadv")
        this.connection.onopen = () => {
          console.log("WebSocket connected successfully.")
          this.connected = true;
          this.connection.send(JSON.stringify({
            userKey: STREAM_KEY,
            symbol: this.currency
          }))
        }

        this.connection.onmessage = (event) => {
          console.log('Websocket message: ', event);
          if(event?.data){
            try{
              const data = JSON.parse(event.data);
              data?.mid && this.$emit('updateCurrency', data.mid)
            }catch (e) {
              console.warn("Data not parsable.", e)
            }
          }
        }

        this.connection.onclose = () => {
          this.connected = false;
          console.log('WebSocket closed.')
        }

        this.connection.onerror = (message) => {
          console.log("Websocket error:" + message);
        };
      }
    },
  },
  created() {
    this.createWebSocket();
  }
}
</script>
  
<style>
</style>