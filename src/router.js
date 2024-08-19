import {createRouter, createWebHistory} from "vue-router";
import OcrAndGPT from "@/components/OcrAndGPT.vue";
import Helper from "@/components/Helper.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: OcrAndGPT, meta: {title: "SnapAnswer"}},
        {path: '/help', component: Helper, meta: {title: "Help"}},
        {path: '/:pathMatch(.*)', component: OcrAndGPT, meta: {title: "SnapAnswer"}},
    ]
})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title
    next()
})

export default router;