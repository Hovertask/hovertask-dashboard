import { toast } from "sonner";
import apiEndpointBaseURL from "../../../../utils/apiEndpointBaseURL";

export default async function connectAccount(form: unknown) {
    try {
        await fetch(`${apiEndpointBaseURL}/socials/manual-connect`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${localStorage.auth_token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(form)
        })
    } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong!")
    }
}