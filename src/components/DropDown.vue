<template>
  <div class="btn-group">
    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption !== ''">
      {{ selectedOption }}
      <ArrowDownIcon 
        :className="`arrow ${showMenu && 'open'}`"
      />
    </li>
    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption === ''">
      {{ placeholder}}
      <ArrowDownIcon 
        :className="`arrow ${showMenu && 'open'}`"
      />
    </li>
    <ul :class="['dropdown-menu ', {'opened': showMenu}]">
      <li v-for="(option, idx) in options" :key="idx">
        <a @click="updateOption(option)">
          {{ option.currency }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import ArrowDownIcon from '../assets/ArrowDownIcon.vue';

  export default {
    data() {
      return {
        selectedOption: "",
        showMenu: false,
        placeholderText: "Please select an item",
      };
    },
    components: {
      "ArrowDownIcon": ArrowDownIcon
    },
    props: {
      options: { type: [Array, Object] },
      selected: { code: [String], currency: [String] },
      placeholder: [String],
      closeOnOutsideClick: {
        type: [Boolean],
        default: true,
      },
    },
    emits: ["updateOption"],
    mounted() {
      this.selectedOption = this.selected.currency;
      if (this.placeholder) {
        this.placeholderText = this.placeholder;
      }
      if (this.closeOnOutsideClick) {
        document.addEventListener("click", this.clickHandler);
      }
    },
    beforeDestroy() {
        document.removeEventListener("click", this.clickHandler);
    },
    methods: {
      updateOption(option) {
        this.selectedOption = option.currency;
        this.showMenu = false;
        this.$emit("updateOption", option);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      clickHandler(event) {
        const { target } = event;
        const { $el } = this;
        if (!$el.contains(target)) {
            this.showMenu = false;
        }
      },
    },
}
</script>

<style scoped lang="scss">
.btn-group {
  min-width: 160px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.btn-group a:hover {
  text-decoration: none;
}
.dropdown-toggle {
  transition: all 200ms ease-in-out;
  min-width: 160px;
  padding: 10px 20px 10px 15px;
  background-color: var(--background-color-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border: 2px solid var(--border-primary-color);
  border-radius: 0.5rem;
  color: var(--text-primary-color);
  font-weight: 500;
    &:hover{
      background: var(--hover-primary-color);
      cursor: pointer;
    }
}
.dropdown-menu {
  transition: all 200ms ease-in-out;
  position: absolute;
  left: 0;
  z-index: 1000;
  float: left;
  min-width: calc(100% - 3px);
  padding: 5px 0;
  list-style: none;
  font-size: 0.85rem;
  text-align: left;
  background-color: var(--background-color-primary);
  border: 2px solid var(--border-primary-color);
  border-radius: 0.5rem;
  box-shadow: 0px 9px 10px 0px var(--box-shadow-primary-color);
  overflow: auto;
  opacity: 0;
  margin: 0;
  max-height: 300px;
  visibility: hidden;
    & li{
      display: none;
    }
    &.opened{
      visibility: visible;
      opacity: 1;
      & li{
        display:block;
        display: block;
        font-weight: normal;
        white-space: nowrap;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        height: 40px;

        & a{
          transition: all 200ms ease-in-out;
          cursor: pointer;
          height: 100%;
          display: flex;
          align-items: center;
          color: var(--text-primary-color);
          padding: 0 1.5rem;
          &:hover{
            background: var(--hover-primary-color);
            font-weight: 600;
          }
        }
      }
    }
}


.arrow{
  transition: all 200ms ease-in-out;
  width: 15px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 15px;
  fill: var(--icon-primary-color);
   &.open{
    rotate: 180deg;
   }
}
</style>