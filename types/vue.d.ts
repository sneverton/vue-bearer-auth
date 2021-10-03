/**
 * Extends interfaces in Vue.js
 */

import { Framework } from "./index";

declare module "vue/types/vue" {
  interface Vue {
    $auth: Framework;
  }
}
