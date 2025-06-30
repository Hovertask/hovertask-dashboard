import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";

const getAuthUSerTasks = async () => {
  try {
    const response = await fetch(
      `${apiEndpointBaseURL}/advertise/authuserads`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      },
    );

    if (!response.ok) return setTimeout(getAuthUSerTasks, 3000);

    return ((await response.json()).data);
  } catch {
    setTimeout(getAuthUSerTasks, 3000);
  }
}

export default getAuthUSerTasks;