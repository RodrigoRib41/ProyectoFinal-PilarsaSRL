const INITIAL_PASSWORD_PREFIX = "INITIAL$";
const ACTIVE_PASSWORD_PREFIX = "ACTIVE$";

export type PasswordState = {
  hash: string;
  mustChangePassword: boolean;
};

export function getPasswordState(password: string): PasswordState {
  if (password.startsWith(INITIAL_PASSWORD_PREFIX)) {
    return {
      hash: password.slice(INITIAL_PASSWORD_PREFIX.length),
      mustChangePassword: true,
    };
  }

  if (password.startsWith(ACTIVE_PASSWORD_PREFIX)) {
    return {
      hash: password.slice(ACTIVE_PASSWORD_PREFIX.length),
      mustChangePassword: false,
    };
  }

  return {
    hash: password,
    mustChangePassword: false,
  };
}

export function wrapInitialPassword(hash: string) {
  return `${INITIAL_PASSWORD_PREFIX}${hash}`;
}

export function wrapActivePassword(hash: string) {
  return `${ACTIVE_PASSWORD_PREFIX}${hash}`;
}

export function isRootAdminUsername(username: string | null | undefined) {
  return username?.trim().toLowerCase() === "admin";
}
