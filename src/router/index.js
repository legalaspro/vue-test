import { createRouter, createWebHistory } from 'vue-router';
import EventList from '../views/EventList.vue';
import EventLayout from '@/views/event/Layout.vue';
import EventDetails from '@/views/event/Details.vue';
import EventRegister from '@/views/event/Register.vue';
import EventEdit from '@/views/event/Edit.vue';
import EventCreate from '@/views/EventCreate.vue';
import About from '@/views/About.vue';
import NotFound from '@/views/NotFound.vue';
import NetworkError from '@/views/NetworkError.vue';
import NProgress from 'nprogress';
import GStore from '@/store/GStore';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'EventList',
    component: EventList,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
  },
  {
    path: '/events/:id',
    name: 'EventLayout',
    props: true,
    component: EventLayout,
    beforeEnter: (to) => {
      return store.dispatch('fetchEvent', to.params.id);
    },
    children: [
      {
        path: '',
        name: 'EventDetails',
        component: EventDetails,
      },
      {
        path: 'register',
        name: 'EventRegister',
        component: EventRegister,
      },
      {
        path: 'edit',
        name: 'EventEdit',
        component: EventEdit,
        meta: { requireAuth: true }, // automatically inherited to all the children
      },
    ],
  },
  {
    path: '/events/create',
    name: 'EventCreate',
    component: EventCreate,
  },
  {
    path: '/event/:afterEvent(.*)',
    redirect: (to) => {
      return { path: '/events/' + to.params.afterEvent };
    },
    // redirect: () => {
    //   return { name: 'EventDetails' }
    // },
    // children: [
    //   { path: 'register', redirect: () => ({ name: 'EventRegister' }) },
    //   { path: 'edit', redirect: () => ({ name: 'EventEdit' }) },
    // ],
  },
  {
    path: '/about-us',
    name: 'About',
    component: About,
  },
  // {
  //   path: '/about',
  //   redirect: { name: 'About' },
  // },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/404/:resource',
    name: '404Resource',
    component: NotFound,
    props: true,
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: NetworkError,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }; // scrolls user to the top on navigation
    }
  },
});

router.beforeEach((to, from) => {
  NProgress.start();

  const notAuthorized = true;
  if (to.meta.requireAuth && notAuthorized) {
    GStore.flashMessage = 'Sorry, you are not authorized to view this page';

    setTimeout(() => {
      GStore.flashMessage = '';
    }, 3000);

    if (from.href) {
      return false;
    } else {
      return { path: '/' };
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
