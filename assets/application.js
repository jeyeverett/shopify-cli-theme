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
      const { data, timestamp } = this.state.cart;
      if (!reload && data["items"] && this.isFresh(timestamp)) {
        return;
      } else {
        try {
          const response = await fetch("/cart.js");
          const cartData = await response.json();
          this.state.cart.data = cartData;
          this.state.cart.timestamp = Date.now();
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

        //refresh the cart (store.getCart() is defined in application.js) then open it
        await this.getCart();
        this.toggleCartModal();
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

  store.vue
    .getCart()
    .then(() => store.initComponents())
    .catch((err) => console.log(err));
};

// window.onbeforeunload = () => {
//   store.saveState();
// };
