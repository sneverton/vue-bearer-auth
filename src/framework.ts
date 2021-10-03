import { AxiosResponse } from "axios";
import { State, Options, PresetConfig } from "types";
import merge from "lodash.merge";
import { preset } from "./preset";
import { VueConstructor } from "vue";

class Framework<
  LoginD = unknown,
  LoginR = unknown,
  CheckR = unknown,
  LogoutR = unknown,
  StateU = unknown
> {
  protected readonly $axios: Options["axios"];

  protected readonly $config: PresetConfig;

  public readonly state: State<StateU>;

  public constructor(Vue: VueConstructor, options: Options) {
    this.$axios = options.axios;
    this.$config = merge({}, preset, options.config);

    this.state = Vue.observable({
      on: false,
      checking: true,
      user: null,
    });
  }

  public async login<D = LoginD, R = LoginR>(
    data: D,
    token: (data: R) => string,
    user?: (data: R) => StateU
  ): Promise<AxiosResponse<R>> {
    return this.$axios.post<R>(this.$config.routes.login, data).then((res) => {
      localStorage.setItem(this.$config.localStorageKey, token(res.data));

      if (user) this.state.user = user(res.data);

      return res;
    });
  }

  public async check<R = CheckR>(
    user?: (data: R) => StateU
  ): Promise<AxiosResponse<R> | null> {
    const token = localStorage.getItem(this.$config.localStorageKey);

    if (!token) {
      this.state.checking = false;
      this.state.on = false;

      return null;
    }

    const headers = { Authorization: `Bearer ${token}` };

    return this.$axios
      .post<R>(this.$config.routes.check, null, { headers })
      .then((res) => {
        this.state.checking = false;
        this.state.on = true;

        if (user) this.state.user = user(res.data);

        return res;
      });
  }

  public async logout<R = LogoutR>(): Promise<AxiosResponse<R> | null> {
    if (!this.state.on) return null;

    return this.$axios.post<R>(this.$config.routes.logout).then((res) => {
      this.state.on = false;
      this.state.user = null;
      localStorage.removeItem(this.$config.localStorageKey);

      return res;
    });
  }
}

export { Framework };
