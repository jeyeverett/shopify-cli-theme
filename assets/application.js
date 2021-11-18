// Put your application javascript here

// Components:
const productCardComponent = {};

const store = {
  vue: {
    components: [],

    state: {
      cart: {
        visible: false,
        data: {},
        timestamp: null,
        loading: false,
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
      products: {},
    },

    async getCart(reload = false) {
      this.cartLoading(true);
      const { data, timestamp } = this.state.cart;
      // use the cached cart if the product is already in the cart and the timestamp is valid
      // reload forces a refetch (which we need to make a cart quantity update dynamically visible)
      if (!reload && data["items"] && this.isFresh(timestamp)) {
        this.cartLoading(false);
        return;
      } else {
        try {
          const response = await fetch("/cart.js");
          const cartData = await response.json();
          this.state.cart.data = cartData;
          this.state.cart.timestamp = Date.now();
          this.cartLoading(false);
          return;
        } catch (err) {
          console.log(err);
        }
      }
    },

    async addToCart(data) {
      try {
        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // throw error
        }

        await this.getCart(true);
        this.state.cart.visible = true;
      } catch (err) {
        console.log(err);
      }
    },

    async incCartItem(item) {
      const data = {
        id: item.key,
        quantity: item.quantity + 1,
      };

      try {
        await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        return this.getCart(true);
      } catch (err) {
        console.log(err);
      }
    },

    async decCartItem(item) {
      const data = {
        id: item.key,
        quantity: item.quantity > 1 ? item.quantity - 1 : 0,
      };

      try {
        await fetch("/cart/change.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return this.getCart(true);
      } catch (err) {
        console.log(err);
      }
    },

    cartLoading(bool) {
      this.state.cart.loading = bool;
    },

    isFresh(timestamp) {
      // check if timestamp is less than 30 minutes old
      const time = Date.now();
      if ((time - timestamp) / 1000 < 1800) {
        return true;
      } else {
        return false;
      }
    },

    async getProductData(productHandle) {
      try {
        const response = await fetch(`/products/${productHandle}.js`);
        const data = await response.json();
        this.state.products[data.id] = data;
        this.state.products[data.id].timestamp = Date.now();
        return data;
      } catch (err) {
        console.log(err);
      }
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
    // setTimeout is needed here to clear the main thread, allowing the Vue apps to load.
    // Without it, if we are using cached data then this code will run prematurely
    // setTimeout(() => {
    this.vue.components.forEach((initComponent) => {
      initComponent(this.vue.state);
    });
    // }, 200);
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

const storeInit = async () => {
  const savedState = store.loadState();
  const state = savedState ? savedState : store.vue.state;
  store.vue.state = Vue.reactive({ ...state });

  try {
    await store.vue.getCart();
    store.initComponents();
  } catch (err) {
    console.log(err);
  }
};

window.onload = storeInit;

window.onbeforeunload = () => {
  store.saveState();
};
