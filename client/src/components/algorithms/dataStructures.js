// client/src/components/algorithms/dataStructures.js
import { toast } from 'react-toastify';

const MAX_SIZE = 12; // Define max size for stack and queue

export const stackOperations = (initialData, operationType, operationValue) => {
  const animations = [];
  let stack = initialData.map(item => ({ ...item })); // Create a deep copy to avoid mutation

  animations.push({ type: 'initial', stack: stack.map(item => ({ ...item })) });

  switch (operationType) {
    case 'push':
      if (stack.length >= MAX_SIZE) {
        toast.error('Stack is full, cannot push!');
        animations.push({ type: 'error', message: 'Stack is full, cannot push.' });
        return { finalStack: stack, animations }; // Return current state without modification
      }
      const pushValue = { id: Date.now(), value: operationValue };
      stack.push(pushValue);
      animations.push({ type: 'push', value: pushValue, stack: stack.map(item => ({ ...item })) });
      if (stack.length === MAX_SIZE) {
        toast.info('Stack is now full!');
      }
      break;
    case 'pop':
      if (stack.length > 0) {
        const poppedValue = stack.pop();
        animations.push({ type: 'pop', value: poppedValue, stack: stack.map(item => ({ ...item })) });
        if (stack.length === 0) {
          toast.info('Stack is now empty!');
        }
      } else {
        toast.error('Stack is empty, cannot pop!');
        animations.push({ type: 'error', message: 'Stack is empty, cannot pop.' });
      }
      break;
    case 'peek':
      if (stack.length > 0) {
        animations.push({ type: 'peek', value: stack[stack.length - 1], stack: stack.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: 'Stack is empty, cannot peek.' });
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
        animations.push({ type: 'error', message: `Element ${operationValue} not found in stack.` });
      }
      break;
    default:
      animations.push({ type: 'error', message: `Unknown stack operation: ${operationType}` });
  }

  return { finalStack: stack, animations };
};

export const queueOperations = (initialData, operationType, operationValue) => {
  const animations = [];
  let queue = initialData.map(item => ({ ...item })); // Create a deep copy

  animations.push({ type: 'initial', queue: queue.map(item => ({ ...item })) });

  switch (operationType) {
    case 'enqueue':
      if (queue.length >= MAX_SIZE) {
        toast.error('Queue is full, cannot enqueue!');
        animations.push({ type: 'error', message: 'Queue is full, cannot enqueue.' });
        return { finalQueue: queue, animations }; // Return current state without modification
      }
      const enqueueValue = { id: Date.now(), value: operationValue };
      queue.push(enqueueValue);
      animations.push({ type: 'enqueue', value: enqueueValue, queue: queue.map(item => ({ ...item })) });
      if (queue.length === MAX_SIZE) {
        toast.info('Queue is now full!');
      }
      break;
    case 'dequeue':
      if (queue.length > 0) {
        const dequeuedValue = queue.shift();
        animations.push({ type: 'dequeue', value: dequeuedValue, queue: queue.map(item => ({ ...item })) });
        if (queue.length === 0) {
          toast.info('Queue is now empty!');
        }
      } else {
        toast.error('Queue is empty, cannot dequeue!');
        animations.push({ type: 'error', message: 'Queue is empty, cannot dequeue.' });
      }
      break;
    case 'peek':
      if (queue.length > 0) {
        animations.push({ type: 'peek', value: queue[0], queue: queue.map(item => ({ ...item })) });
      } else {
        animations.push({ type: 'error', message: 'Queue is empty, cannot peek.' });
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
        animations.push({ type: 'error', message: `Element ${operationValue} not found in queue.` });
      }
      break;
    default:
      animations.push({ type: 'error', message: `Unknown queue operation: ${operationType}` });
  }

  return { finalQueue: queue, animations };
};
