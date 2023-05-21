<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="max-width: 800px; min-width: 600px">
      <div class="q-my-md">
        <q-btn :to="{name: 'task'}" dense flat >
          <q-icon left size="1em" name="arrow_back"></q-icon>
          <div>Retour</div>
        </q-btn>
      </div>

      <div class="cursor-pointer q-mb-md">
        <q-tooltip>
          Double clique pour modifier
        </q-tooltip>
        {{detail}}
        <q-popup-edit v-model="detail" auto-save v-slot="scope" @save="onChangeDetail">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"></q-input>
        </q-popup-edit>
      </div>

      <CreateChildrenTaskComponent :parent-id="taskId" @init="init" />

      <div class="q-mt-lg">

        <TaskItemComponent :items="children" @reload="init" :children="true" />

      </div>

    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import TaskItemComponent from 'components/TaskItemComponent.vue';
import {errorMessage, TaskEntity, UpdateTaskDto} from 'components/models';
import {Task} from 'src/services/Task';
import {ErrorHelper} from 'src/utils/ErrorHelper';
import {head, isArray} from 'lodash';
import {useRoute} from 'vue-router';
import CreateChildrenTaskComponent from 'components/CreateChildrenTaskComponent.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {CreateChildrenTaskComponent, TaskItemComponent},
  setup () {
    const route = useRoute();
    const id: string = isArray(route.params.id) ? head(route.params.id) ?? '' : route.params.id;
    const taskId = ref<number>(0);
    const loading = ref<boolean>(false);
    const detail = ref<string>();
    const task = ref<TaskEntity | null>(null);
    const children = ref<TaskEntity[]>([]);
    onMounted( () => {
      taskId.value = parseInt(id, 10);
      init();
    });
    const init = async () => {
      try {
        loading.value = true;
        Task.findOne(taskId.value).then((resp: TaskEntity) => {
          task.value = resp;
          children.value = resp.children ?? [];
          detail.value = task.value.detail;
        });
      } catch (e: any) {
        errorMessage.value = ErrorHelper(e);
      }
      loading.value = false;
    }
    const onChangeDetail = async(value: string, initValue:string) => {
      // update
      if (task.value) {
        loading.value = true;
        const data: UpdateTaskDto = {
          id: taskId.value,
          detail: value,
          priority: task.value.priority
        };
        const response = await Task.update(data);
        loading.value = false;
      }
    }
    return {
      loading,
      children,
      task,
      taskId,
      detail,
      errorMessage,
      onChangeDetail,
      init
    };
  }
});
</script>
