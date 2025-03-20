import { createApp } from "../vendor/vue.js";
import HeaderComponent from "../components/header.js";
import FooterComponent from "../components/footer.js";
import ExtLink from "../components/ext-link.js";
import HeroComponent from "../components/hero.js";

export const app = createApp({
    components: {
        HeaderComponent,
        FooterComponent,
        ExtLink,
        HeroComponent,
    },
    data() {},
    mounted() {
        const url = new URL(window.location.href);
        // Previously the calculator was sitting at the root of the site. If urlVer is present, redirect to the calculator
        if (url.searchParams.has("urlVer")) {
            const { origin, search } = url;
            window.location.href = `${origin}/calculator/index.html${search}`;
        }
    },
});

app.mount("#app");
