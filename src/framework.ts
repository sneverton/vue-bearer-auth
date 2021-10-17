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
      checking: true,
      user: null,
    });
  }

  public async login<D = LoginData, R = LoginResponse>(
    data: D,
    token: (data: R) => string,
    user?: (data: R) => StateUser
  ): Promise<AxiosResponse<R>> {
    const res = await this.$axios.post<R>(this.$config.routes.login, data);

    localStorage.setItem(this.$config.localStorageKey, token(res.data));

    if (user) this.state.user = user(res.data);

    return res;
  }

  public async check<R = CheckResponse>(
    user?: (data: R) => StateUser
  ): Promise<AxiosResponse<R> | null> {
    const token = localStorage.getItem(this.$config.localStorageKey);

    if (!token) {
      this.state.checking = false;
      this.state.on = false;

      return null;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const res = await this.$axios.post<R>(this.$config.routes.check, null, {
      headers,
    });

    this.state.checking = false;
    this.state.on = true;

    if (user) this.state.user = user(res.data);

    return res;
  }

  public async logout<R = LogoutResponse>(): Promise<AxiosResponse<R> | null> {
    if (!this.state.on) return null;

    const res = await this.$axios.post<R>(this.$config.routes.logout);

    this.state.on = false;
    this.state.user = null;
    localStorage.removeItem(this.$config.localStorageKey);

    return res;
  }
}

export { Framework };
