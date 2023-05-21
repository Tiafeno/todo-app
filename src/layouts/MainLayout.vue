<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          {{userData?.name ?? "Todo app"}}
        </q-toolbar-title>

        <div style="
          display: flex;
          align-content: center;
          justify-content: space-between;
          align-items: center;">
          <div > v{{ appVersion }}</div>
          <div class="q-ml-md">
            <q-btn dense flat icon="logout" @click="logOut"></q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {Cookies} from 'quasar';
import {useRouter} from 'vue-router';
import {userData} from 'components/models';


export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const appVersion = process.env.APP_VERSION;
    const logOut = async () => {
      const key = 'jwt-token';
      if (Cookies.has(key)) {
        Cookies.remove(key);
        await router.push({name: 'login'});
      }
    };
    return {
      leftDrawerOpen,
      appVersion,
      userData,
      logOut
    }
  }
});
</script>
