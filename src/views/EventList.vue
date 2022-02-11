<template>
  <div class="events">
    <h1>Events For Good</h1>
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="pagination">
      <div class="page">
        <router-link
          id="page-prev"
          :to="{ name: 'EventList', query: { page: page - 1 } }"
          rel="prev"
          v-if="page != 1"
        >
          &#60; Page</router-link
        >
      </div>

      <div class="page numeration">
        <router-link
          v-for="num in totalPages"
          :to="{ name: 'EventList', query: { page: num } }"
          :key="num"
          :class="{ currentPage: num === page }"
        >
          <span>{{ num }}</span>
        </router-link>
      </div>

      <div class="page">
        <router-link
          id="page-next"
          :to="{ name: 'EventList', query: { page: page + 1 } }"
          rel="next"
          v-if="hasNextPage"
        >
          Page &#62;</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EventCard from '@/components/EventCard.vue';
import store from '@/store';

export default {
  name: 'EventList',
  props: ['page'],
  components: {
    EventCard,
  },
  computed: {
    events() {
      return this.$store.state.events;
    },
    totalEvents() {
      return this.$store.state.totalEvents;
    },
    totalPages() {
      return Math.ceil(this.totalEvents / 2);
    },
    hasNextPage() {
      var totalPages = Math.ceil(this.totalEvents / 2);
      return this.page < totalPages;
    },
  },
  // created() {
  //   watchEffect(() => {
  //     this.events = null;
  //     EventService.getEvents(this.perPage, this.page)
  //       .then((response) => {
  //         this.events = response.data;
  //         this.totalEvents = response.headers['x-total-count'];
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   });
  // },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store
      .dispatch('fetchEvents', {
        perPage: 2,
        page: parseInt(routeTo.query.page) || 1,
      })
      .then(next)
      .catch(() => {
        next({ name: 'NetworkError' });
      });
    // EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
    //   .then((response) => {
    //     next((comp) => {
    //       comp.$store.commit('SET_EVENTS', response.data);
    //       comp.$store.commit(
    //         'SET_TOTAL_EVENTS',
    //         response.headers['x-total-count']
    //       );
    //     });
    //   })
    //   .catch(() => {
    //     next({ name: 'NetworkError' });
    //   });
  },
  beforeRouteUpdate(routeTo) {
    return this.$store
      .dispatch('fetchEvents', {
        perPage: 2,
        page: parseInt(routeTo.query.page) || 1,
      })
      .catch(() => {
        return { name: 'NetworkError' };
      });

    // EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
    //   .then((response) => {
    //     this.$store.commit('SET_EVENTS', response.data);
    //     this.$store.commit(
    //       'SET_TOTAL_EVENTS',
    //       response.headers['x-total-count']
    //     );
    //   })
    //   .catch(() => {
    //     return { name: 'NetworkError' };
    //   });
  },
};
</script>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  text-decoration: none;
  color: #2c3e50;
}
.page {
  flex: 1;
}
.numeration {
  text-align: center;
}
a.currentPage {
  text-decoration: underline;
}
.numeration span {
  padding: 2px;
}

#page-prev {
  text-align: left;
}

#page-next {
  text-align: right;
}
</style>
