<template>
    <div @click="onClickTheme()" class="toggle-container">
        <LightModeIcon :className="'icon light'"/>
        <DarkModeIcon :className="'icon dark'"/>
        <div :class="`toggle ${theme}`"></div>
    </div>
</template>

<script>
import DarkModeIcon from '../assets/DarkModeIcon.vue';
import LightModeIcon from '../assets/LightModeIcon.vue';
import { getTheme, setTheme } from '../utils/utils';
export default {
    data() {
        return {
            theme: ''
        }
    },
    mounted() {
        //check if user has dark theme selected or has preference
        const initUserTheme = getTheme() || this.getMediaPreference();
        this.theme = initUserTheme;
        setTheme(initUserTheme);
    },
    methods: {
        onClickTheme() {
            const activeTheme = localStorage.getItem("theme-mode");
            const theme = activeTheme === "light-theme" ? "dark-theme" : "light-theme";
            this.theme = theme;
            setTheme(theme);
        },
        getMediaPreference() {
            const darkModePreferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (darkModePreferred) {
                return "dark-theme";
            }
            else {
                return "light-theme";
            }
        }
    },
    components: { 
        LightModeIcon, 
        DarkModeIcon 
    }
}
</script>

<style scoped lang="scss">
.toggle-container{
  transition: all 200ms ease-in-out;
    width: 60px;
    height: 30px;
    background: var(--background-color-primary);
    border: 2px solid var(--border-primary-color);
    border-radius: 50px;
    position: absolute;
    top: 15px;
    right: 0;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    padding: 0 0.2rem;
}

.icon{
    margin: auto;
    height: 25px;
    fill: var(--icon-primary-color);
    &.light{
        margin-left: 0;
    }
    &.dark{
        margin-right: 0;
    }
}
.toggle{
  transition: all 200ms ease-in-out;
    position: absolute;
    width: 22px;
    z-index: 1;
    background: var(--background-color-primary);
    border: 2px solid var(--border-primary-color);
    border-radius: 100%;
    display: flex;
    height: 22px;
    top: 2px;
        &.light-theme{
            left: 2px
        }   
        &.dark-theme{
            left: 38px
        }
        &:focus-visible{
            outline: none;
        }
}
</style>