import apiEndpointBaseURL from "../../../utils/apiEndpointBaseURL";

const getAuthUSerTasks = () => new Promise((resolve) => {
  let timeout: number | undefined = undefined;

  fetch(
    `${apiEndpointBaseURL}/advertise/authuserads`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    },
  )
    .then(res => res.json())
    .then(res => {
      resolve(res.data);
      if (timeout) clearTimeout(timeout);
    })
    .catch(() => {
      timeout = setTimeout(getAuthUSerTasks, 3000);
    })
})

export default getAuthUSerTasks;