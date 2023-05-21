<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {Auth, instanceAxios} from 'src/services/Auth';
import {Cookies} from 'quasar';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {useRouter} from 'vue-router';
import {AxiosResponse} from 'axios';
import {ErrorHelper} from 'src/utils/ErrorHelper';
import {userData} from 'components/models';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const loading = ref<boolean>(false);
    const email = ref<string>('');
    const password = ref<string>('');
    const router = useRouter();
    const errorMessage = ref<string>('');
    onMounted(() => {
      console.log(process.env);
    })
    const onSubmit = async () => {
      loading.value = true;
      const dataInput = {
        email: email.value,
        password: password.value
      }
      try {
        const response: AxiosResponse = await Auth.signIn(dataInput);
        const accessData = response.data;
        // set authorization
        const token = cloneDeep(accessData.key.access_token);
        userData.value = accessData.payload;
        instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // set cookie with expiration date
        const expireDate = moment();
        expireDate.add(accessData.key.expiresIn, 'seconds');
        Cookies.set('jwt-token', token, {
          secure: false,
          path: '/',
          expires: expireDate.toDate()
        });
        await router.push({name: 'task'});
      } catch (e: any) {
        errorMessage.value = ErrorHelper(e);
      }
      loading.value = false;
    }
    return {
      email,
      password,
      loading,
      errorMessage,
      onSubmit
    }
  }
})
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="max-width: 400px; min-width: 350px">

      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="email"
          label="Votre adresse email *"
          hint="Adresse email"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Champ requis']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Mot de passe *"
          lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Champ requis',
        ]"
        />

        <div>
          <div class="q-my-md" v-if="errorMessage.length > 0">
            <q-banner inline-actions class="text-white bg-red">
              {{ errorMessage }}
            </q-banner>
          </div>
          <q-btn label="S'identifier" :loading="loading" type="submit" color="primary"/>
        </div>
      </q-form>

    </div>
  </q-page>
</template>

<style scoped>

</style>
