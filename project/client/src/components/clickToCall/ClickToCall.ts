

export const isInvalid = (value: string): string => !value && hasError.value ? "invalid" : "";