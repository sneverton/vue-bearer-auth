import { Framework } from "./framework";
const install = (Vue, options) => {
    if (!(options === null || options === void 0 ? void 0 : options.axios)) {
        throw new Error("VueBearerAuth: para o plugin funcionar é necessário definir a opção 'axios'.");
    }
    Vue.prototype.$auth = new Framework(Vue, options);
};
export { install };
//# sourceMappingURL=install.js.map