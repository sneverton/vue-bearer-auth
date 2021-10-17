import { __awaiter } from "tslib";
import merge from "lodash.merge";
import { preset } from "./preset";
class Framework {
    constructor(Vue, options) {
        this.$axios = options.axios;
        this.$config = merge({}, preset, options.config);
        this.state = Vue.observable({
            on: false,
            user: null,
            checking: false,
            loggingIn: false,
            loggingOut: false,
        });
    }
    login(data, token, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.on)
                throw new Error("O usuário já está on.");
            this.state.on = false;
            this.state.loggingIn = true;
            try {
                const res = yield this.$axios.post(this.$config.routes.login, data);
                localStorage.setItem(this.$config.localStorageKey, token(res.data));
                this.state.on = true;
                if (user)
                    this.state.user = user(res.data);
                return res;
            }
            finally {
                this.state.loggingIn = false;
            }
        });
    }
    check(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.on)
                throw new Error("O usuário já está on.");
            this.state.checking = true;
            const token = localStorage.getItem(this.$config.localStorageKey);
            if (!token) {
                this.state.checking = false;
                this.state.on = false;
                return null;
            }
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const res = yield this.$axios.post(this.$config.routes.check, null, {
                    headers,
                });
                this.state.on = true;
                if (user)
                    this.state.user = user(res.data);
                return res;
            }
            finally {
                this.state.checking = false;
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.on)
                throw new Error("O usuário já está off.");
            if (!this.state.on)
                return null;
            this.state.loggingOut = true;
            try {
                const res = yield this.$axios.post(this.$config.routes.logout);
                this.state.on = false;
                this.state.user = null;
                localStorage.removeItem(this.$config.localStorageKey);
                return res;
            }
            finally {
                this.state.loggingOut = false;
            }
        });
    }
}
export { Framework };
//# sourceMappingURL=framework.js.map