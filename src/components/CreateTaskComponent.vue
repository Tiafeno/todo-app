<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Task} from 'src/services/Task';
import {CreateTaskDto} from 'components/models';
import {useQuasar} from 'quasar';

export default defineComponent({
  name: 'CreateTaskComponent',
  emits: ['reload'],
  setup(_, {emit}) {
    const $q = useQuasar();
    const loading = ref<boolean>(false);
    const detail = ref<string>('');
    const onCreateTask = async () => {
      if (detail.value.length <= 10) {
        $q.notify({
          message: '10 characters minimum',
          color: 'negative'
        })
        return false;
      }
      loading.value = true;
      const data: CreateTaskDto = {
        detail: detail.value,
        priority: 0,
      };
      const response = await Task.create(data);
      loading.value = false;
      detail.value = '';
      emit('reload');
    }
    return {
      detail,
      onCreateTask
    }
  }
})
</script>

<template>
  <q-form>
    <q-input outlined bottom-slots v-model="detail" label="Description" counter maxlength="100">
      <template v-slot:hint>
        Ajouter l'information de votre tâche
      </template>

      <template v-slot:append>
        <q-btn @click="onCreateTask" round dense flat icon="add"/>
      </template>
    </q-input>
  </q-form>
</template>

<style scoped>

</style>
