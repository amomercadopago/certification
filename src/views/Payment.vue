<template>
  <RouterLink to="/">to Catalog</RouterLink>
  <component :is="'script'" src="https://www.mercadopago.com/v2/security.js" view="payment" />
  <div :class="`card text-center text-white mb-3 ${bgColor}`">
    <div class="card-header">Payment result</div>
    <div class="card-body">
      <h5 class="card-title">Payment result - "{{ result }}"</h5>
      <p class="card-text">
        <div
          v-for="(name, value) in paymentData"
          :key="name"
        >
          {{ value }}: {{ name }}
        </div>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'payment',
  computed: {
    result() {
      return this.$route?.query?.result;
    },
    paymentData() {
      const paymentId = this.getDataFromQuery(this.$route?.query?.payment_id);
      const collectionId = this.getDataFromQuery(this.$route?.query?.collection_id);

      return {
        payment_method_id: this.$route?.query?.payment_method_id,
        external_reference: this.$route?.query?.external_reference,
        payment_id: paymentId ?? collectionId ?? null,
      };
    },
    bgColor() {
      switch (this.result) {
        case 'success':
          return 'bg-success';
        case 'pending':
          return 'bg-warning';
        default:
          return 'bg-danger';
      }
    },
  },
  methods: {
    getDataFromQuery(string) {
      return string === 'null'
        ? null
        : string
      ;
    },
  },
};
</script>
