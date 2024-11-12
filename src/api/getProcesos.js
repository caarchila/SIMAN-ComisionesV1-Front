import { BASE_URL, BASE_URL_SERVER } from "./base.api";

const getProcesos = async () => {
  const response = await fetch(BASE_URL + "/procesos/get-procesos", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
  });

  return response.json();
};

export default getProcesos;
