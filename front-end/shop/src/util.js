
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "./api";
import defaultImg from "../../../uploads/default.jpg";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function fetchApiFunc(data = null, apiUrl, apiMethod, token = "") {

  let method = apiMethod.toUpperCase();

  let options = {
    method: method,
    headers: {
      Authorization: token === "" ? token : `Bearer ${token}`,
    }
  }

  if (method !== "GET" && data !== null) {
    options.body = data;
  }

  const response = await fetch(apiUrl, options);

  const result = await response.json();
  return result;
}

export function checkFormInputIsEmpty(form) {

  const inputs = form.querySelectorAll("input");

  return [...inputs].some(input => !input.value || input.value.trim() === "");
}

export function isImg(s) {
  return s === "img" || s === "image" || s === "background";
}

export function genID() {
  return crypto.randomUUID();
}

export function getImgPath(img) {
  if (!img) return defaultImg;
  let folder = img.split("_")[0];
  let path = `${api.upload}/${folder}/${img}`;
  return path;
}

export function removeFieldFromArray(arr, fields) {
  return arr.map(e => {
    const newItem = { ...e };
    fields.forEach(field => delete newItem[field]);
    return newItem;
  })
}


export function parseDate(dateStr) {
  const chars = ['-', '/'];
  for (let c of chars) {
    const [year, month, day] = dateStr.split(c);
    if (!year || !month || !day) continue;
    return new Date(year, month - 1, day);
  }

  return new Date("2000", "0", "10");
}


export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-');
  return day + "/" + month + "/" + year;
}

export function isFieldsFilled(form, exeptionIds = {}) {
  const inputs = [...form.querySelectorAll("input")];
  const textAreas = [...form.querySelectorAll("textarea")];
  const selects = [...form.querySelectorAll("select")];

  const fields = [...inputs, ...textAreas, ...selects];
  for (let field of fields) {
    if (exeptionIds[field.id]) continue;
    if (!field.value) {
      return false;
    }
  }
  return true;
}

export function getEventBadgeValue(start, end) {
  const startAt_ = parseDate(start);
  const endAt_ = parseDate(end);
  const now = new Date();
  return now < startAt_ ? "COMING" : (startAt_ <= now && now < endAt_) ? "AVALIBLE" : "UNAVALIBLE";
}