import { UserProfile } from "@auth0/nextjs-auth0";
import { atom } from "recoil";

export const UserState = atom<UserProfile | null>({
  key: "user",
  default: null,
});
