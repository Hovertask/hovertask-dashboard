export const phoneNumberValidation = {
	value: /^\+?\d{8,16}$/,
	message: "Enter a valid number",
};

export const urlValidation = {
	value:
		/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i,
	message: "Enter a valid url.",
};

export const descriptionValidation = {
	value: /\w+(?:\s*.+){20,}/,
	message: "Enter a valid description.",
};
