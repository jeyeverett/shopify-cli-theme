// Put your application javascript here

// Components:

const store = {
  vue: {
    components: [],

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
        input: "",
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
    toggleSearchModal() {
      this.state.search.visible = !this.state.search.visible;
    },
    closeAll() {
      this.state.account.visible = false;
      this.state.cart.visible = false;
      this.state.mobile.visible = false;
      this.state.search.visible = false;
    },
  },

  initComponents() {
    this.vue.components.forEach((initComponent) =>
      initComponent(this.vue.state)
    );
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
      JSON.stringify(this.vue.state)
    );
  },
};

const savedState = store.loadState();

document.getElementById("vue").onload = () => {
  const state = savedState ? savedState : store.vue.state;
  store.vue.state = Vue.reactive({ ...state });

  store.initComponents();
};

window.onbeforeunload = () => {
  store.saveState();
};
