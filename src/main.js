import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/global.less";
import {
  Layout,
  Menu,
  Button,
  Icon,
  Tabs,
  Select,
  DatePicker,
  Table,
  Checkbox,
  Pagination,
  Spin,
  Modal,
  ConfigProvider,
  Input,
  Upload,
  Form,
  message,
  Switch,
  FormModel,
  Row,
  Col,
  AutoComplete,
  Skeleton
} from "ant-design-vue";

Vue.use(Layout);
Vue.use(Menu);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Table);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Spin);
Vue.use(Modal);
Vue.use(ConfigProvider);
Vue.use(Input);
Vue.use(Upload);
Vue.use(Form);
Vue.use(Switch);
Vue.use(FormModel);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);
Vue.use(AutoComplete);
Vue.use(Skeleton);

Vue.prototype.$message = message;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
