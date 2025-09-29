import { toast } from "react-toastify";

export async function handleApi(promise) {
  try {
    const res = await promise;
    const msg = res.data?.message;
    const sucess = res.data?.success;
    if (msg) {
      if (sucess)
        toast.success(msg);
      else toast.error(msg);
    }
    return res.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    if (errorMsg) {
      toast.error(errorMsg);
    }
    throw err; // để component vẫn có thể handle thêm
  }
}
