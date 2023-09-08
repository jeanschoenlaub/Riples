type FieldErrors = Record<string, string[] | undefined>;

export const handleZodError = (fieldErrors: FieldErrors | undefined): string => {
  const messages: string[] = [];

  if (fieldErrors) {
    Object.keys(fieldErrors).forEach((field: string) => {
      const fieldErrorMessages = fieldErrors[field];
      if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0 && fieldErrorMessages[0]) {
        const message = fieldErrorMessages[0]; // directly use the string
        messages.push(message);
      }
    });

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return "An unknown error occurred. Please try again later.";
};
