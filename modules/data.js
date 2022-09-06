import axios from "axios";

export async function getData(url, id) {
  const response = await axios.get(url + (id ? id : ""));
  return response.data;
}
