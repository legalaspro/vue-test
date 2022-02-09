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
import EventService from '@/services/EventService.js';
// import { watchEffect } from 'vue';

export default {
  name: 'EventList',
  props: ['page'],
  components: {
    EventCard,
  },
  data() {
    return {
      events: null,
      totalEvents: 0,
    };
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
    EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
      .then((response) => {
        next((comp) => {
          comp.events = response.data;
          comp.totalEvents = response.headers['x-total-count'];
        });
      })
      .catch(() => {
        next({ name: 'NetworkError' });
      });
  },
  beforeRouteUpdate(routeTo) {
    return EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
      .then((response) => {
        this.events = response.data;
        this.totalEvents = response.headers['x-total-count'];
      })
      .catch(() => {
        return { name: 'NetworkError' };
      });
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalEvents / 2);
    },
    hasNextPage() {
      var totalPages = Math.ceil(this.totalEvents / 2);
      return this.page < totalPages;
    },
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
