import { EvidenceGraphql } from "@hooks";
import { STATUS_CLOSED } from "@shared/constants";
import moment from "moment-timezone";
import { toast } from "sonner";

export const nowDateWithTime = () => moment().format("DD/MM/YYYY h:mm a");

export const notify = (message: string, success?: boolean) => {
  if (success) {
    toast.success("¡ Correcto !", {
      description: message,
      duration: 7000,
    });
  } else {
    toast.error("¡ Atención !", {
      description: message,
      duration: 7000,
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

  const apiBaseUrl = process.env.NEXT_PUBLIC_URL_API_RAW;
  const url = `${apiBaseUrl}${path}${image}`;

  console.log({ url });

  return url;
};

export const stringToDateWithTime = (date: string | Date) => {
  return moment(date).format("DD/MM/YYYY h:mm a");
};

// Format 05 - January - 2024
export const stringToDate = (date: string | Date) =>
  moment(date).format("DD MMMM YYYY");

export const durantionToTime = (row: EvidenceGraphql) => {
  const { createdAt, solutionDate, status } = row;

  if (!solutionDate || status !== STATUS_CLOSED) return "";

  const duration = moment.duration(
    moment(solutionDate).diff(moment(createdAt)),
  );

  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (Number(row.id) === 3) {
    console.log({
      id: row.id,
      hours,
      minutes,
      seconds,
      createdAt: moment(createdAt).format("DD/MM/YYYY h:mm a"),
      solutionDate: moment(solutionDate).format("DD/MM/YYYY h:mm a"),
    });
  }

  return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""} ${
    seconds ? seconds + "s" : ""
  }`;
};

export const stringYYYYMMDDToDDMMYYYY = (dateString: string) => {
  const date = dateString.split("T")[0].split("-");
  return `${date[2]}/${date[1]}/${date[0]}`;
};

export { resolveTriStateSort } from "./triStateSort";
export type { SortOrder } from "./triStateSort";
