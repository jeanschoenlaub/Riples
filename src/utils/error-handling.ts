/* eslint-disable */
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";

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


export function handleMutationError(e: unknown, reject: (reason?: any) => void) {
  if (isZodError(e)) {
      const fieldErrors = (e as { data: { zodError: { fieldErrors: any } } }).data.zodError.fieldErrors; 
      if (fieldErrors) {
          const message = handleZodError(fieldErrors);
          toast.error(message);
          reject(e);
      } else {
          // Handle any other unknown errors here if needed
          reject(e);
      }
  }
  else if (isTRPCClientError(e)) {
      toast.error(e.message);
      reject(e);
      return;
  }
}

function isZodError(error: unknown): error is { data: { zodError: { fieldErrors: any } } } {
  if (typeof error !== "object" || error === null) return false;
  
  const data = (error as any).data;
  if (!data || typeof data !== "object" || !('zodError' in data)) return false;

  const zodError = data.zodError;
  if (!zodError || typeof zodError !== "object" || !('fieldErrors' in zodError)) return false;

  return true;
}

// Similarly, you can define another type guard for TRPCClientError
function isTRPCClientError(error: unknown): error is TRPCClientError<any> {
  return error instanceof TRPCClientError;
}