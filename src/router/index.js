import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store'
import Home from "../views/Home.vue";
import Login from "../views/auth/login";
import Register from "../views/auth/register";
import Dashboard from "../views/back/dashboard";
import Product from "../views/back/product";
import Category from "../views/back/category";
import Majorcat from "../views/back/majorcat";

Vue.use(VueRouter);

var token = store.getters.Token
const routes = [
  {path: "/",name: "Home",component: Home},
  {path: "/login",component: Login},
  {path: "/register",component: Register},
  {path: "/dashboard",component: Dashboard, beforeEnter(to, from, next) {
    if (token){
      next()
    }else{
      next('/login')
    }
  }},
  {path: "/product",component: Product, beforeEnter(to, from, next) {
    if (token){
      next()
    }else{
      next('/login')
    }
  }},
  {path: "/category",component: Category, beforeEnter(to, from, next) {
    if (token){
      next()
    }else{
      next('/login')
    }
  }},
  {path: "/majorcat",component: Majorcat, beforeEnter(to, from, next) {
    if (token){
      next()
    }else{
      next('/login')
    }
  }},
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "../views/About.vue");
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
