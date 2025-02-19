import { useState, useCallback, useEffect } from "react";

const useToast = () => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(({ message, type = "success" }) => {
    setToast({
      open: true,
      message,
      type,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  useEffect(() => {
    return () => {
      setToast({
        open: false,
        message: "",
        type: "success",
      });
    };
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

export default useToast;
