import "vue";
import { createApp, defineComponent } from "vue";
import { add } from "@/helper";

add(1, 2);

const App = defineComponent({
  template: "<div>VUE FAST</div>",
});

createApp(App).mount("#app");
