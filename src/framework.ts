import { AxiosResponse } from "axios";
import { State, Options, PresetConfig } from "types";
import merge from "lodash.merge";
import { preset } from "./preset";
import { VueConstructor } from "vue";

class Framework<
  LoginData = unknown,
  LoginResponse = unknown,
  CheckResponse = unknown,
  LogoutResponse = unknown,
  StateUser = unknown
> {
  public readonly $axios: Options["axios"];
  public readonly $config: PresetConfig;
  public readonly state: State<StateUser>;

  constructor(Vue: VueConstructor, options: Options) {
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

  public async login<D = LoginData, R = LoginResponse>(
    data: D,
    token: (data: R) => string,
    user?: (data: R) => StateUser
  ): Promise<AxiosResponse<R>> {
    if (this.state.on) throw new Error("O usuário já está on.");

    this.state.on = false;
    this.state.loggingIn = true;

    try {
      const res = await this.$axios.post<R>(this.$config.routes.login, data);

      localStorage.setItem(this.$config.localStorageKey, token(res.data));
      this.state.on = true;

      if (user) this.state.user = user(res.data);

      return res;
    } finally {
      this.state.loggingIn = false;
    }
  }

  public async check<R = CheckResponse>(
    user?: (data: R) => StateUser
  ): Promise<AxiosResponse<R> | null> {
    if (this.state.on) throw new Error("O usuário já está on.");

    this.state.checking = true;
    const token = localStorage.getItem(this.$config.localStorageKey);

    if (!token) {
      this.state.checking = false;
      this.state.on = false;

      return null;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await this.$axios.post<R>(this.$config.routes.check, null, {
        headers,
      });

      this.state.on = true;

      if (user) this.state.user = user(res.data);

      return res;
    } finally {
      this.state.checking = false;
    }
  }

  public async logout<R = LogoutResponse>(): Promise<AxiosResponse<R> | null> {
    if (!this.state.on) throw new Error("O usuário já está off.");

    if (!this.state.on) return null;
    this.state.loggingOut = true;

    try {
      const res = await this.$axios.post<R>(this.$config.routes.logout);

      this.state.on = false;
      this.state.user = null;
      localStorage.removeItem(this.$config.localStorageKey);

      return res;
    } finally {
      this.state.loggingOut = false;
    }
  }
}

export { Framework };
