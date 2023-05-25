<template>
    <button class="themes-icon-box">
        <div class="c-theme__grid" :style="{'top': top + 'px'}">
            <svg fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1" title="Dark"><path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"></path></svg>
            <svg fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1" title="Sunset"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>
            <svg fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1" title="Sunrise"><path d="M20 15.31 23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>
            <svg fill="currentColor" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1" title="Light"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>
        </div>
    </button>
</template>

<script lang="ts">

import { computed } from "vue";
import { useThemeStore } from "@/store/theme";
import { theme } from "@/interface/enum";

export default ({
    setup() {

        const themeStore = useThemeStore();

        const top = computed(() => {
            if(themeStore.getSystemTheme === theme.defaultTheme) {
                return 0
            };
            return -18
        });

		console.log(top, '=====')

        return {
            top
        }
    },
})
</script>

<style scoped lang="scss">
.themes-icon-box {
    position: absolute;
	// top: 2.4rem;
	// right: 2.4rem;
	width: 1em;
	height: 1em;
	cursor: pointer;
	display: inline-block;
	overflow: hidden;
	padding: 0;
	margin: 0;
	background: transparent;
	color: var(--text-primary);
	border: 1px solid transparent;
	border-radius: 0.8rem;
	// padding: .4rem;
	transition: all 120ms ease-out;
	&:hover, &:focus {
		border-color: var(--border);
	}
	&:after, &:before {
		content: '';
		position: absolute;
		z-index: 10;
	}
	&:after {
		top: 0;
		left: 0;
		right: 0;
		height: .8rem;
		background: linear-gradient(to bottom, var(--surface), transparent);
	}
	&:before {
		bottom: 0;
		left: 0;
		right: 0;
		height: .8rem;
		background: linear-gradient(to top, var(--surface), transparent);
	}
	&:focus {
		outline: none;
	}
	&__grid {
		position: relative;
		width: 1em;
		transition: all 240ms ease-out;
	}
    svg {
		width: 1em;
		height: 1em;
        display: block;
		&:focus {
			outline: none;
		}
	}
}

.c-theme__grid{
    position: relative;
}
</style>