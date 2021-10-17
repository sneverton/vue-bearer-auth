import { AxiosInstance, AxiosResponse } from "axios";
import { PluginObject } from "vue";

export interface State<U = unknown> {
  on: boolean;
  checking: boolean;
  user: U | null;
  loggingIn: boolean;
  loggingOut: boolean;
}

export interface Routes {
  login?: string;
  check?: string;
  logout?: string;
}

export interface Config<R = Routes> {
  localStorageKey?: string;
  routes?: R;
}

export type PresetConfig = Required<Config<Required<Routes>>>;

export interface Options<R = Routes> {
  axios: AxiosInstance;
  config?: Config<R>;
}

export declare class Framework<
  LoginData = unknown,
  LoginResponse = unknown,
  CheckResponse = unknown,
  LogoutResponse = unknown,
  StateUser = unknown
> {
  constructor(Vue: VueConstructor, options: Options);

  public readonly $axios: Options["axios"];
  public readonly $config: PresetConfig;
  public readonly state: State<StateUser>;

  public async login(
    data: LoginData,
    token: (data: LoginResponse) => string,
    user?: (data: LoginResponse) => StateUser
  ): Promise<AxiosResponse<R>>;

  public async check(
    user?: (data: CheckResponse) => StateUser
  ): Promise<AxiosResponse<CheckResponse> | null>;

  public async logout(): Promise<AxiosResponse<LogoutResponse> | null>;
}

declare const _default: PluginObject<Options>;

export default _default;
