<template>
  <component :is="'script'" src="https://www.mercadopago.com/v2/security.js" view="catalog" />
  <div
    v-for="(productsRow, row) in productsByRow"
    :key="row"
    class="row"
  >
    <div
      v-for="product in productsRow"
      :key="product.id"
      class="col-md-4"
    >
      <figure class="card card-product">
        <div class="img-wrap">
          <img :src="product.picture_url">
        </div>
        <figcaption class="info-wrap">
          <h6 class="title text-dots">
            <RouterLink :to="{ name: 'detail', params: { id: product.id }}">{{ product.title }}</RouterLink>
          </h6>
          <div class="action-wrap">
            <div class="price-wrap h5">
              <span class="price-new">{{ product.currency }}{{ product.unit_price }}</span>
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</template>
<script>
import products from "../products";

export default {
  name: 'catalog',
  data() {
    return {
      elementsByRow: 3,
    };
  },
  computed: {
    productsByRow() {
      let currentElements = [];
      const result = [];

      for (let i in products) {
        currentElements.push(products[i]);
        if (i > 0 && (i + 1) % this.elementsByRow === 0) {
          result.push([...currentElements]);
          currentElements = [];
        }
      }

      return result;
    },
  },
};
</script>
