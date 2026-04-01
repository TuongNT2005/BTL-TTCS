
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "./api";
import defaultImg from "../../../uploads/default.jpg";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function fetchApiFunc(data=null, apiUrl, apiMethod, token="") {

  let method = apiMethod.toUpperCase();

  let options = {
    method: method,
    headers: {
      Authorization: token === "" ? token : `Bearer ${token}`,
    }
  }

  if(method !== "GET" && data !== null) {
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
    if(!img) return defaultImg;
    let folder = img.split("_")[0];
    let path = `${api.upload}/${folder}/${img}`;
    return path;
}