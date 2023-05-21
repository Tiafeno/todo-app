<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {TaskEntity, UpdateTaskDto} from 'components/models';
import {Task} from 'src/services/Task';

export default defineComponent({
  name: 'TaskItemComponent',
  props: {
    items: {
      type: Array as PropType<TaskEntity[]>,
      required: true
    },
    children: {
      type: Boolean,
      required: false,
    }
  },
  emits: ['reload'],
  setup(_, {emit}) {
    const loading = ref<boolean>(false);
    // On delete task
    const onDelete = async (taskId: number) => {
      loading.value = true;
      await Task.remove(taskId);
      emit('reload');
      loading.value = false;
    }

    const onEditDetail = async (item: TaskEntity, value: string) => {
      loading.value = true;
      const data: UpdateTaskDto = {
        id: item.id,
        detail: value
      };
      await Task.update(data);
      loading.value = false;
    }

    const onTogglePriority = async (item: TaskEntity) => {
      loading.value = true;
      const data: UpdateTaskDto = {
        id: item.id,
        detail: item.detail,
        priority: item.priority == 1 ? 0 : 1
      }
      await Task.update(data);
      emit('reload');
      loading.value = false;
    }

    const onToggleStatus = async (item: TaskEntity) => {
      console.log('has change');
      loading.value = true;
      const data: UpdateTaskDto = {
        id: item.id,
        detail: item.detail,
        finished: item.finished
      };
      await Task.update(data);
      loading.value = false;
    }
    return {
      loading,
      onDelete,
      onTogglePriority,
      onEditDetail,
      onToggleStatus
    }
  }
})
</script>

<template>
  <q-list bordered padding v-if="items.length > 0">
    <q-item  v-for="item of items" :key="item.id" :disable="loading">
      <q-item-section side top>
        <q-checkbox v-model:model-value="item.finished" @update:model-value="() => {
          onToggleStatus(item)
        }" />
      </q-item-section>

      <q-item-section>
        <q-item-label :style="{'finishedTask': item.finished}">
          <span :class="{'finishedTask': item.finished}">{{ item.detail }}</span>
          <q-popup-edit v-model="item.detail" auto-save v-slot="scope" @save="(value, initValue) => {
            onEditDetail(item, value);
          }">
            <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"></q-input>
          </q-popup-edit>
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn class="gt-xs" size="12px"
                 :to="{ name: 'task-edit', params: {id: item.id}}" flat dense round
                 v-if="!children"
                 icon="edit_note"/>
          <q-btn class="gt-xs" size="12px"
                 @click="onTogglePriority(item)"
                 :color="item.priority == 1 ? 'red-8': 'grey-8'"
                 flat dense round icon="flag"/>
          <q-btn size="12px" @click="onDelete(item.id)" flat dense round icon="delete"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped>
.finishedTask {
  text-decoration: line-through
}
</style>
