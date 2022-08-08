<template>
  <RouterLink to="/">to Catalog</RouterLink>
  <component :is="'script'" src="https://www.mercadopago.com/v2/security.js" view="detail" />
  <br />
  <div
    v-if="product"
    class="row m-0"
  >
    <div class="col-lg-4 left-side-product-box pb-3">
      <img
        id="product_img"
        class="border p-3"
        :src="product.picture_url"
      >
    </div>
    <div class="col-lg-8">
      <div class="right-side-pro-detail border p-3 m-0">
        <div class="row">
          <div class="col-lg-12">
            <p id="product_title" class="m-0 p-0"> {{ product.title }} </p>
          </div>
          <div class="col-lg-12">
            <p id="product_price" class="m-0 p-0 price-pro"> {{ product.unit_price.toLocaleString() }} {{ product.currency }} </p>
            <hr class="p-0 m-0">
          </div>
          <div class="col-lg-3">
            <br />
            <h6>Quantity</h6>
            <input
              v-model.number="quantity"
              id="product_quantity"
              type="number"
              class="form-control text-center w-100"
            >
          </div>
          <div class="col-lg-12 mt-2">
            <hr class="p-0 m-0">
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="progress"
                :style="`width: ${progress}%;`"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ progress }}%
              </div>
            </div>
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control form-control-sm" id="name" v-model="payer.name">
            </div>
            <div class="form-group">
              <label for="surname" class="form-label">Surname</label>
              <input type="text" class="form-control form-control-sm" id="surname" v-model="payer.surname">
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control form-control-sm" id="email" v-model="payer.email">
            </div>
            <div class="form-row">
              <div class="form-group col-3">
                <label for="cityCode">City code</label>
                <select class="form-control form-control-sm" id="cityCode" v-model="payer.phone.area_code">
                  <option>11</option>
                </select>
              </div>
              <div class="form-group col-9">
                <label for="number">Phone number</label>
                <input type="number" class="form-control form-control-sm" id="number" v-model.number="payer.phone.number">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label for="street">Street</label>
                <input type="text" class="form-control form-control-sm" id="street" v-model="payer.address.street">
              </div>
              <div class="form-group col-3">
                <label for="homeNumber">Home number</label>
                <input type="text" class="form-control form-control-sm" id="homeNumber" v-model="payer.address.homeNumber">
              </div>
              <div class="form-group col-3">
                <label for="postIndex">Post index</label>
                <input type="number" class="form-control form-control-sm" id="postIndex" v-model.number="payer.address.postIndex">
              </div>
            </div>
            <button
              v-if="!preferenceId"
              class="button"
              :disabled="isLoading || !formValid"
              @click="createPreference"
            >
              En la cesta
            </button>
            <div v-if="isError" class="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Oops!</strong> Something went wront! Try again later...
              <button @click="isError = false" type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div class="col-lg-12 mt-2">
            <hr class="p-0 m-0">
            <br />
            <div class="cho-container" id="cho-container"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Product not found!</div>
</template>
<script>
import products from "../products";
import axios from 'axios';

export default {
  name: 'detail',
  watch: {
    preferenceId(value) {
      if (!value || !this.mp) {
        return;
      }

      this.mp.checkout({
        preference: {
          id: value,
        },
        render: {
          container: '.cho-container',
          label: 'Pagar la compra',
        }
      });
    },
  },
  data() {
    return {
      mp: null,
      quantity: 1,
      preferenceId: null,
      payer: {
        name: '',
        surname: '',
        email: '',
        phone: {
          area_code: 11,
          number: '',
        },
        address: {
          street: '',
          homeNumber: '',
          postIndex: '',
        },
      },
      isLoading: false,
      isError: false,
    };
  },
  mounted() {
    this.mp = new MercadoPago('APP_USR-ee70a80f-0848-4b7f-991d-497696acbdcd', {
      locale: 'en-US'
    });
  },
  computed: {
    productId() {
      return this.$route?.query?.id;
    },
    product() {
      if (!this.productId) {
        return null;
      }

      return products.find((item) => +item.id === +this.productId);
    },
    formValid() {
      return this.payer.name?.length
        && this.payer.surname?.length
        && this.payer.email?.length
        && this.payer.phone.area_code
        && this.payer.phone.number
        && this.quantity > 0
      ;
    },
    progress() {
      const needFileds = [
        this.payer.name,
        this.payer.surname,
        this.payer.email,
        this.payer.phone.number,
      ];

      return Math.floor(needFileds.filter((item) => item.toString().length).length / needFileds.length * 100) ;
    },
  },
  methods: {
    createPreference() {
      if (!this.formValid) {
        return false;
      }
      this.isLoading = true;
      this.isError = false;
      axios({
        method: 'post',
        url: 'https://mercado-pago.amocrmmarket.com/preference/create',
        data: {
          payer: this.payer,
          products: [{ ...this.product, quantity: this.quantity }],
        },
      })
        .then(({ data }) => {
          this.preferenceId = data.data.id;
        })
        .catch(() => this.isError = true)
        .finally(() => this.isLoading = false)
      ;
    },
  },
};
</script>
