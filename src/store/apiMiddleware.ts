import { useStore } from "./index";

type ApiOptions<T> = {
  apiCall: () => Promise<T>;
  onSuccess?: (data: T) => void;
  successMessage?: string;
  errorMessage?: string;
  showLoader?: boolean;
};

export const apiHandler = async <T>({
  apiCall,
  onSuccess,
  successMessage,
  errorMessage,
  showLoader = true,
}: ApiOptions<T>) => {
  const { showLoader: start, hideLoader, showToast } = useStore.getState();

  try {
    if (showLoader) start();

    const data = await apiCall();

    if (successMessage) {
      showToast({ severity: "success", message: successMessage });
    }

    onSuccess?.(data);

    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : errorMessage || "Something went wrong";

    showToast({
      severity: "error",
      message,
    });

    throw error;
  } finally {
    if (showLoader) hideLoader();
  }
};