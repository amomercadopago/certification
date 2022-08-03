<template>
  <RouterLink to="/">to Catalog</RouterLink>
  <component :is="'script'" src="https://www.mercadopago.com/v2/security.js" view="detail" />
  <br />
  <div
    v-if="product"
    class="row m-0"
  >
    <div class="col-lg-6 left-side-product-box pb-3">
      <img
        id="product_img"
        class="border p-3"
        :src="product.picture_url"
      >
    </div>
    <div class="col-lg-6">
      <div class="right-side-pro-detail border p-3 m-0">
        <div class="row">
          <div class="col-lg-12">
            <p id="product_title" class="m-0 p-0"> {{ product.title }} </p>
          </div>
          <div class="col-lg-12">
            <p id="product_price" class="m-0 p-0 price-pro"> {{ product.currency }}{{ product.unit_price }} </p>
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
            <button class="button" v-if="!formValid" @click="createPreference">En la cesta</button>
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
  data() {
    return {
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
    };
  },
  mounted() {
    const mp = new MercadoPago('APP_USR-ee70a80f-0848-4b7f-991d-497696acbdcd', {
      locale: 'en-US'
    });

    mp.checkout({
      preference: {
        id: '469485398-2a8901c0-1ade-4c20-805e-3962547a1ebe',
      },
      render: {
        container: '.cho-container',
        label: 'Pagar la compra',
      }
    });
  },
  computed: {
    productId() {
      return this.$route?.params?.id;
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
        && this.payer.address.street?.length
        && this.payer.address.homeNumber?.length
        && this.payer.address.postIndex
        && this.quantity > 0
      ;
    },
  },
  methods: {
    createPreference() {
      if (!this.formValid) {
        // return false;
      }
      axios.defaults.headers.post = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      };

      axios({
        method: 'post',
        url: 'https://t1.amocrm.vpool.qsoft.ru/preference/create',
        // url: '/api/preference/create',
        data: {
          payer: this.payer,
          products: [this.product],
        },
      })
        .then(({ data }) => {
          console.log(data);
        })
      ;
    },
  },
};
</script>
