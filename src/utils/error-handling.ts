export const handleZodError = (error: any) => {
    const fieldErrors = error.data?.zodError?.fieldErrors;
    let messages: any[] = [];
  
    if (fieldErrors) {
      Object.keys(fieldErrors).forEach((field) => {
        const fieldErrorMessages = fieldErrors[field];
        if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
          messages.push(fieldErrorMessages[0]);
        }
      });
  
      if (messages.length > 0) {
        return messages.join(" | ");
      }
    }
  
    return "An unknown error occurred. Please try again later.";
  };