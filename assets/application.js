// Put your application javascript here

const store = {
  vue: {},
  initComponents(state) {
    headerComponent(state);
  },
  loadState() {
    const state = window.sessionStorage.getItem("shopify-store");
    if (state === "undefined" || state === "{}") {
      window.sessionStorage.removeItem("shopify-store");
      return false;
    } else {
      return JSON.parse(state);
    }
  },
  saveState() {
    window.sessionStorage.setItem(
      "shopify-store",
      JSON.stringify(this.vue["state"])
    );
  },
};

document.getElementById("vue").onload = () => {
  const state = store.loadState();
  let initialState;

  if (!state) {
    initialState = {
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
        input: "",
      },
    };
  }

  store.vue = Vue.reactive({
    state: state ? state : initialState,

    toggleCartModal() {
      this.state.cart.visible = !this.state.cart.visible;
    },
    toggleAccountModal() {
      this.state.account.visible = !this.state.account.visible;
    },
    toggleMobileModal() {
      this.state.mobile.visible = !this.state.mobile.visible;
    },
    toggleSearchModal() {
      this.state.search.visible = !this.state.search.visible;
    },
    closeAll() {
      this.state.account.visible = false;
      this.state.cart.visible = false;
      this.state.mobile.visible = false;
      this.state.search.visible = false;
    },
  });

  store.initComponents(state || initialState);
};

window.onbeforeunload = () => {
  store.saveState();
};
