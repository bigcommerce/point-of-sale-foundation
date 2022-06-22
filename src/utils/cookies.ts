import { setCookie, destroyCookie } from "nookies";

export const setCookieOnBackend = (res, key, value, options = {}) => {
  setCookie({ res }, key, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "none",
    secure: true,
    ...options
  });
};

export const destroyCookieOnBackend = (res, key) => {
  destroyCookie({ res }, key, {
    path: "/"
  });
};
