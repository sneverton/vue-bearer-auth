import { AxiosInstance, AxiosResponse } from "axios";

export interface State<U = unknown> {
  on: boolean;
  checking: boolean;
  user: U | null;
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
  LoginD = unknown,
  LoginR = unknown,
  CheckR = unknown,
  LogoutR = unknown,
  StateU = unknown
> {
  constructor(Vue: VueConstructor, options: Options);

  public readonly $axios: Options["axios"];
  public readonly $config: PresetConfig;
  public readonly state: State<StateU>;

  public login(
    data: LoginD,
    token: (data: LoginR) => string,
    user?: (data: LoginR) => StateU
  ): Promise<AxiosResponse<R>>;

  public check(
    user?: (data: CheckR) => StateU
  ): Promise<AxiosResponse<CheckR> | null>;

  public logout(): Promise<AxiosResponse<LogoutR> | null>;
}

declare const _default: PluginObject<Options>;

export default _default;
