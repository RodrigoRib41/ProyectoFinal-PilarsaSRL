import { requestApi } from "@/lib/api/client";

export type InternalUserRole = "STOCK" | "SERVICES" | "FINANZAS" | "SUPERADMIN";
export type InternalUserSummary = {
  id: number;
  username: string;
  role: InternalUserRole;
  mustChangePassword: boolean;
  isRootAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RegisterInternalUserPayload = {
  username: string;
  password: string;
  role: InternalUserRole;
};

export type RegisterInternalUserResponse = {
  success: boolean;
  data: {
    id: number;
    username: string;
    role: InternalUserRole;
    mustChangePassword: boolean;
    createdAt: string;
  };
};

export type InternalUsersResponse = {
  success: boolean;
  data: InternalUserSummary[];
};

export type ResetInternalUserPasswordPayload = {
  password: string;
  confirmPassword: string;
};

export type ResetInternalUserPasswordResponse = {
  success: boolean;
  message: string;
  data: InternalUserSummary;
};

export type FirstAccessPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type FirstAccessPasswordResponse = {
  success: boolean;
  message: string;
};

export async function registerInternalUser(payload: RegisterInternalUserPayload) {
  return requestApi<RegisterInternalUserResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getInternalUsers() {
  return requestApi<InternalUsersResponse>("/api/auth/usuarios");
}

export async function resetInternalUserPassword(
  id: number,
  payload: ResetInternalUserPasswordPayload,
) {
  return requestApi<ResetInternalUserPasswordResponse>("/api/auth/usuarios", {
    method: "PATCH",
    body: {
      id,
      ...payload,
    },
  });
}

export async function deleteInternalUser(id: number) {
  return requestApi<void>(`/api/auth/usuarios?id=${id}`, {
    method: "DELETE",
  });
}

export async function completeFirstAccessPassword(payload: FirstAccessPasswordPayload) {
  return requestApi<FirstAccessPasswordResponse>("/api/auth/primer-acceso", {
    method: "POST",
    body: payload,
  });
}
