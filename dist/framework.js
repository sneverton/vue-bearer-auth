import { __awaiter } from "tslib";
import merge from "lodash.merge";
import { preset } from "./preset";
class Framework {
    constructor(Vue, options) {
        this.$axios = options.axios;
        this.$config = merge({}, preset, options.config);
        this.state = Vue.observable({
            on: false,
            checking: true,
            user: null,
        });
    }
    login(data, token, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.$axios.post(this.$config.routes.login, data).then((res) => {
                localStorage.setItem(this.$config.localStorageKey, token(res.data));
                if (user)
                    this.state.user = user(res.data);
                return res;
            });
        });
    }
    check(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem(this.$config.localStorageKey);
            if (!token) {
                this.state.checking = false;
                this.state.on = false;
                return null;
            }
            const headers = { Authorization: `Bearer ${token}` };
            return this.$axios
                .post(this.$config.routes.check, null, { headers })
                .then((res) => {
                this.state.checking = false;
                this.state.on = true;
                if (user)
                    this.state.user = user(res.data);
                return res;
            });
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.on)
                return null;
            return this.$axios.post(this.$config.routes.logout).then((res) => {
                this.state.on = false;
                this.state.user = null;
                localStorage.removeItem(this.$config.localStorageKey);
                return res;
            });
        });
    }
}
export { Framework };
//# sourceMappingURL=framework.js.map