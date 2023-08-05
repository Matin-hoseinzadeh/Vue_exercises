Vue.component("moreDetail", {
  props: {
    details: {
      type: Array,
      require: true,
    }
  },
  template:
    `
  <ul>
    <li v-for="size in details">{{ size }}</li>
  </ul>
  `,
})
Vue.component("product", {
  template: ` 
  <div class="product">
    <div class="product-image">
      <a :href="link" :title="altText" class="res">
        <img :src="imageSrc" :alt="altText" />
      </a>
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
      <p>{{ sale }}</p>
      <moreDetail :details="details"></moreDetail>
      <div
        v-for="(variant, index) in variants"
        :key="variant.variantId"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor }"
        @mouseover="updateProduct(index)"
      ></div>
      <ul>
        <li v-for="size in sizes">{{ size }}</li>
      </ul>
      <button
        @click="addToCart()"
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }"
      >
        Add to cart
      </button>
      <button @click="removeFromCart()">Remove from cart</button>
      <div class="cart">
        <p>Cart({{ cart }})</p>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "A pair of warm, fuzzy socks",
      selectedVariant: 0,
      altText: "A pair of Socks",
      link: "https://www.vuemastery.com/courses/intro-to-vue-js/attribute-binding",
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [{
          variantId: 2234,
          variantColor: "green",
          variantImg: "./assets/socks-green.jpg",
          variantQuantity: 1,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImg: "./assets/socks-blue.jpg",
          variantQuantity: 0,
        },
      ],
      onSale: true,
      sizes: ["Small", "Medium", "Large", "XLarge"],
      cart: 0,
    }
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    imageSrc() {
      return this.variants[this.selectedVariant].variantImg;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return `${this.brand} ${this.product} are on sale!`;
      }
      return `${this.brand} ${this.product} are not on sale!`;
    },
  },
});
var app = new Vue({
  el: "#app",
})
Vue.config.devtools = true;