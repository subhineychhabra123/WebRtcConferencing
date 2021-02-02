import React from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const toastConatainer = (message, type = 'info') => {
  const toastList = new Set();
  const MAX_TOAST = 3;

  let toastIdToDismiss = null;
  if (toastList.size === MAX_TOAST) {
    const arr = Array.from(toastList);
    const toastId = arr[0];
    if (toastId) {
      toastIdToDismiss = toastId;
    }
  }

  const id = toast(message, {
    onClose: () => toastList.delete(id),
    onOpen: () => {
      if (toastIdToDismiss !== null) {
        setTimeout(() => {
          toast.dismiss(toastIdToDismiss);
        }, 1000);
      }
    },
    type: type,
    position: 'top-right',
    autoClose: 4000,
  });
  toastList.add(id);
}
export default toastConatainer;
