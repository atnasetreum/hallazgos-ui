import { toast } from "sonner";
import moment from "moment";

import "moment/locale/es";

export const nowDateWithTime = () => moment().format("DD/MM/YYYY h:mm a");

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

export const baseUrlImage = (image: string, path?: string) => {
  if (!path) {
    path = "/static/images/evidences/";
  }

  return `${process.env.NEXT_PUBLIC_URL_API_RAW}${path}${image}`;
};

export const stringToDateWithTime = (date: string | Date) =>
  moment(date).format("DD/MM/YYYY h:mm a");

// Format 05 - January - 2024
export const stringToDate = (date: string | Date) =>
  moment(date).format("DD MMMM YYYY");

export const durantionToTime = (startTime: Date, end: Date) => {
  const duration = moment.duration(moment(end).diff(moment(startTime)));
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""} ${
    seconds ? seconds + "s" : ""
  }`;
};

export const stringYYYYMMDDToDDMMYYYY = (dateString: string) => {
  const date = dateString.split("T")[0].split("-");
  return `${date[2]}/${date[1]}/${date[0]}`;
};
