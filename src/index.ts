import { Options } from "types";
import { PluginObject } from "vue";
import { install } from "./install";

const VueBearerAuth: PluginObject<Options> = { install };

export default VueBearerAuth;
