// client/src/components/algorithms/dataStructures.js
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const MAX_SIZE = 12; // Define max size for stack and queue

export const stackOperations = (initialData, operationType, operationValue) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const animations = [];
  let stack = initialData.map(item => ({ ...item })); // Create a deep copy to avoid mutation

  animations.push({ type: 'initial', stack: stack.map(item => ({ ...item })) });

  switch (operationType) {
    case 'push':
      if (stack.length >= MAX_SIZE) {
        toast.error(t('stack_is_full_cannot_push'));
        animations.push({ type: 'error', message: t('stack_is_full_cannot_push') });
        return { finalStack: stack, animations }; // Return current state without modification
      }
      const pushValue = { id: Date.now(), value: operationValue };
      stack.push(pushValue);
      animations.push({ type: 'push', value: pushValue, stack: stack.map(item => ({ ...item })) });
      if (stack.length === MAX_SIZE) {
        toast.info(t('stack_is_now_full'));
      }
      break;
    case 'pop':
      if (stack.length > 0) {
        const poppedValue = stack.pop();
        animations.push({ type: 'pop', value: poppedValue, stack: stack.map(item => ({ ...item })) });
        if (stack.length === 0) {
          toast.info(t('stack_is_now_empty'));
        }
      } else {
        toast.error(t('stack_is_empty_cannot_pop'));
        animations.push({ type: 'error', message: t('stack_is_empty_cannot_pop') });
      }
      break;
    case 'peek':
      if (stack.length > 0) {
        animations.push({ type: 'peek', value: stack[stack.length - 1], stack: stack.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: t('stack_is_empty_cannot_peek') });
      }
      break;
    case 'pop_element':
      const indexToPop = stack.findIndex(item => String(item.value) === String(operationValue));
      if (indexToPop !== -1) {
        // Animate searching for the element
        for (let i = stack.length - 1; i >= 0; i--) {
          animations.push({ type: 'search', value: stack[i], stack: stack.map(item => ({ ...item })), index: i });
          if (i === indexToPop) break; // Stop search animation at the element
        }
        const removedElement = stack.splice(indexToPop, 1)[0];
        animations.push({ type: 'remove_element', value: removedElement, stack: stack.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: t('element_not_found_in_stack', { operationValue }) });
      }
      break;
    default:
      animations.push({ type: 'error', message: t('unknown_stack_operation', { operationType }) });
  }

  return { finalStack: stack, animations };
};

export const queueOperations = (initialData, operationType, operationValue) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const animations = [];
  let queue = initialData.map(item => ({ ...item })); // Create a deep copy

  animations.push({ type: 'initial', queue: queue.map(item => ({ ...item })) });

  switch (operationType) {
    case 'enqueue':
      if (queue.length >= MAX_SIZE) {
        toast.error(t('queue_is_full_cannot_enqueue'));
        animations.push({ type: 'error', message: t('queue_is_full_cannot_enqueue') });
        return { finalQueue: queue, animations }; // Return current state without modification
      }
      const enqueueValue = { id: Date.now(), value: operationValue };
      queue.push(enqueueValue);
      animations.push({ type: 'enqueue', value: enqueueValue, queue: queue.map(item => ({ ...item })) });
      if (queue.length === MAX_SIZE) {
        toast.info(t('queue_is_now_full'));
      }
      break;
    case 'dequeue':
      if (queue.length > 0) {
        const dequeuedValue = queue.shift();
        animations.push({ type: 'dequeue', value: dequeuedValue, queue: queue.map(item => ({ ...item })) });
        if (queue.length === 0) {
          toast.info(t('queue_is_now_empty'));
        }
      } else {
        toast.error(t('queue_is_empty_cannot_dequeue'));
        animations.push({ type: 'error', message: t('queue_is_empty_cannot_dequeue') });
      }
      break;
    case 'peek':
      if (queue.length > 0) {
        animations.push({ type: 'peek', value: queue[0], queue: queue.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: t('queue_is_empty_cannot_peek') });
      }
      break;
    case 'dequeue_element':
      const indexToDequeue = queue.findIndex(item => String(item.value) === String(operationValue));
      if (indexToDequeue !== -1) {
        // Animate searching for the element
        for (let i = 0; i < queue.length; i++) {
          animations.push({ type: 'search', value: queue[i], stack: queue.map(item => ({ ...item })), index: i });
          if (i === indexToDequeue) break; // Stop search animation at the element
        }
        const removedElement = queue.splice(indexToDequeue, 1)[0];
        animations.push({ type: 'remove_element', value: removedElement, queue: queue.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: t('element_not_found_in_queue', { operationValue }) });
      }
      break;
    default:
      animations.push({ type: 'error', message: t('unknown_queue_operation', { operationType }) });
  }

  return { finalQueue: queue, animations };
};
