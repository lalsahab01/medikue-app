export function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && /^[6-9]\d{9}$/.test(phone.trim());
}

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 6;
}
