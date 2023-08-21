    var eventBus = new Vue()

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

Vue.component('product-tabs', {
  props: {
      reviews: {
        type: Array,
        required: false
      }
    },
  template: `
    <div class="tab_box">
      <span class="tab" :class="{ activeTab: selectedTab === tab }"  v-for="(tab, index) in tabs" :key="index"
      @click="selectedTab = tab">{{ tab }}</span>

      <div v-show="selectedTab === 'Reviews'">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">
        There are no reviews yet.
      </p>
      <ul>
        <li v-for="review in reviews">
          <p>
            {{ review.name }}
          </p>
          <p>
            Rating: {{ review.rating }}
          </p>
          <p>
            {{ review.review }}
          </p>
        </li>
      </ul>
    </div>
    <product-review v-show="selectedTab === 'Make a Review'" ></product-review>
    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review']      ,
      selectedTab: 'Reviews' ,
    }
  }
})

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
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
       <product-tabs :reviews="reviews"></product-tabs>
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
      reviews: [],
    }
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
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
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
  },
      mounted() {
      eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
      })
    }
});
Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>
          Please correct the following error(s) 
        </b>
        <ul>
          <li v-for="error in errors">
            {{ error }}
          </li>
        </ul>
      </p>
      <p>
        <label for="name">
          Name:
        </label>
        <input id="name" v-model="name">
      </p>
      <p>
        <label for="review">
          Review:
        </label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">
          Rating:
        </label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        Would you recommend this product?
      </p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend">
      </label>
      <br>
      <label>
        No
        <input type="radio" value="No" v-model="recommend">
      </label>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
    <input v-model="name">
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
      recommend: false,
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) {
          this.errors.push("Name required");
        }
        if (!this.rating) {
          this.errors.push("Rating required");
        }
        if (!this.review) {
          this.errors.push("Review required");
        }
        if (!this.recommend) {
          this.errors.push("Recommend required");
        }
      }
    },
  },
});
var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
})
Vue.config.devtools = true;