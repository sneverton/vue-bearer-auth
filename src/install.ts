import { Options } from "types";
import { PluginFunction } from "vue";
import { Framework } from "./framework";

const install: PluginFunction<Options> = (Vue, options) => {
  if (!options?.axios) {
    throw new Error(
      "VueBearerAuth: para o plugin funcionar é necessário definir a opção 'axios'."
    );
  }

  Vue.prototype.$auth = new Framework(Vue, options);
};

export { install };
