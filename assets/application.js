// Put your application javascript here

const store = {
  vue: {},
  ready() {
    this.readyListeners.forEach((func) => func());
  },
  readyListeners: [],
  onReady: function (callback) {
    this.readyListeners.push(callback);
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
      mobile: {
        visible: false,
      },
      search: {
        visible: false,
        element() {
          return document.getElementById("search-modal");
        },
      },
    },

    toggleCartModal() {
      this.state.cart.visible = !this.state.cart.visible;
    },
    toggleAccountModal() {
      this.state.account.visible = !this.state.account.visible;
    },
    toggleMobileModal() {
      this.state.mobile.visible = !this.state.mobile.visible;
    },
    toggleSearchModal(target) {
      this.state.search.visible = !this.state.search.visible;
      return this.state.search.visible;
    },
    closeAll() {
      this.state.account.visible = false;
      this.state.cart.visible = false;
      this.state.mobile.visible = false;
    },
  });

  store.ready();
};
