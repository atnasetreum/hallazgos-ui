import { toast } from "sonner";

export const notify = (message: string, success?: boolean) => {
  if (success) {
    toast.success("¡ Correcto !", {
      description: message,
    });
  } else {
    toast.error("¡ Atención !", {
      description: message,
    });
  }
};

export const isValidEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");

  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
