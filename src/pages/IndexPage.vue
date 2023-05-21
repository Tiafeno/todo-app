<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="max-width: 800px; min-width: 600px">

      <CreateTaskComponent @reload="init" />

      <div class="q-mt-lg">
        <div class="q-py-md" style="max-width: 300px">
          <div class="q-gutter-md">
            <q-select v-model="orderBy"
                      :options="orderOptions"
                      @update:model-value="() => {
                        fnFilter()
                      }"
                      emit-value
                      map-options label="Filtre" />
          </div>
        </div>

        <TaskItemComponent :items="tasks" @reload="init" :children="false" />

      </div>

    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import CreateTaskComponent from 'components/CreateTaskComponent.vue';
import TaskItemComponent from 'components/TaskItemComponent.vue';
import {errorMessage, TaskEntity} from 'components/models';
import {Task} from 'src/services/Task';
import {ErrorHelper} from 'src/utils/ErrorHelper';
import {filter, isNull, sortBy} from 'lodash';

export default defineComponent({
  name: 'IndexPage',
  components: {TaskItemComponent, CreateTaskComponent},
  setup () {
    const loading = ref<boolean>(false);
    const tasks = ref<TaskEntity[]>([]);
    const orderBy = ref<string>('id');
    const orderOptions = ref([
      {
        label: 'Priority',
        value: 'priority'
      },
      {
        label: 'Id',
        value: 'id'
      },
    ]);
    onMounted( () => {
      init();
    });
    const init = async () => {
      try {
        loading.value = true;
        Task.getAll().then((resp: TaskEntity[]) => {
          // Filter
          tasks.value = filter(resp, task => isNull(task.parent));
        });
      } catch (e: any) {
        errorMessage.value = ErrorHelper(e);
      }
      loading.value = false;
    }

    const fnFilter = () => {
      tasks.value = sortBy(tasks.value, orderBy.value);
      console.log(tasks.value);
    }
    return {
      loading,
      tasks,
      orderBy,
      orderOptions,
      errorMessage,
      init,
      fnFilter
    };
  }
});
</script>
