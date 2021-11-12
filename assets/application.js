// Put your application javascript here

const store = {
  vue: {},
  isReady: "false",
  get ready() {
    return this.isReady;
  },
  set ready(val) {
    this.isReady = val;
    this.readyListener(val);
  },
  readyListener: function (val) {},
  onReady: function (callback) {
    this.readyListener = callback;
  },
};

document.getElementById("vue").onload = () => {
  store.vue = Vue.reactive({
    state: {
      cart: {
        visible: false,
      },
      account: {
        visible: false,
      },
    },

    toggleCartModal() {
      this.state.cart.visible = !this.state.cart.visible;
    },
    toggleAccountModal() {
      this.state.account.visible = !this.state.account.visible;
    },
    closeAll() {
      this.state.account.visible = false;
      this.state.cart.visible = false;
    },
  });
  store.ready = true;
};
