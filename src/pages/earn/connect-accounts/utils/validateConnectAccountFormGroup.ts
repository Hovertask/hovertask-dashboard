import type { Dispatch, SetStateAction } from "react";
import type { ActivationState } from "../../../../../types";

/**
   * Validates  the form in groups.
   * The validation logic is quite tricky and may be confusing.
   * Note that the form is a group of inputs (username, and profile link), each having it's own validation
   * and submit button (i.e. You can choose to submit only one group).
   * Say for example the user has only their Facebook username and profile link,
   * you could enter it in the appropriate fields, validate it and submit it independently of other input groups.
   */
export default function validateConnectAccountFormGroup(platform: string, fields: { username: string, profileLink: string }, setState: Dispatch<SetStateAction<ActivationState>>) {
  let isValid = false;
  switch (platform) {
    case "facebook":
      if (!/^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9.]{5,}$/.test(fields.username))
        setState((prevState) => ({
          ...prevState,
          facebook: "Error - Invalid username",
        }));
      else if (
        !/^(https?:\/\/)?((web|www)\.)?facebook\.com\/(?!pages\/|groups\/|events\/)([a-zA-Z0-9.]{5,}|profile\.php\?id=\d+)(\/)?$/.test(
          fields.profileLink,
        )
      )
        setState((prevState) => ({
          ...prevState,
          facebook: "Error - Invalid profile link",
        }));
      else isValid = true;
      break;

    case "instagram":
      if (
        !/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/.test(
          fields.username,
        )
      )
        setState((prevState) => ({
          ...prevState,
          instagram: "Error - Invalid username",
        }));
      else if (
        !/^(https?:\/\/)?((web|www)\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})(\/)?$/.test(
          fields.profileLink,
        )
      )
        setState((prevState) => ({
          ...prevState,
          instagram: "Error - Invalid profile link",
        }));
      else isValid = true;

      break;

    case "tikTok":
      if (
        !/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{2,24}$/.test(
          fields.username,
        )
      )
        setState((prevState) => ({
          ...prevState,
          tikTok: "Error - Invalid username",
        }));
      else if (
        !/^(https?:\/\/)?((web|www)\.)?tiktok\.com\/@([a-zA-Z0-9._]{2,24})(\/)?$/.test(
          fields.profileLink,
        )
      )
        setState((prevState) => ({
          ...prevState,
          tikTok: "Error - Invalid profile link",
        }));
      else isValid = true;

      break;

    case "twitter":
      if (!/^[A-Za-z0-9_]{1,15}$/.test(fields.username))
        setState((prevState) => ({
          ...prevState,
          twitter: "Error - Invalid username",
        }));
      else if (
        !/^(https?:\/\/)?((web|www)\.)?twitter\.com\/([A-Za-z0-9_]{1,15})(\/)?$/.test(
          fields.profileLink,
        )
      )
        setState((prevState) => ({
          ...prevState,
          twitter: "Error - Invalid profile link",
        }));
      else isValid = true;
      break;
  }

  return isValid;
}