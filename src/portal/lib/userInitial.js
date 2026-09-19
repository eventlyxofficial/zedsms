import { USER } from "../mocks/seed";

export const userInitial = (USER.email[0] || "?").toUpperCase();
