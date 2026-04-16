"use client";

import { useEffect, useMemo, useState } from "react";
import {
  KeyRound,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus2,
  Users,
} from "lucide-react";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";
import {
  deleteInternalUser,
  getInternalUsers,
  registerInternalUser,
  resetInternalUserPassword,
  type InternalUserRole,
  type InternalUserSummary,
} from "@/lib/api/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleOptions: Array<{
  value: InternalUserRole;
  label: string;
  description: string;
}> = [
  {
    value: "STOCK",
    label: "Stock",
    description: "Publicacion, edicion y baja de usados.",
  },
  {
    value: "SERVICES",
    label: "Service",
    description: "Turnos, vehiculos, ordenes y repuestos.",
  },
  {
    value: "FINANZAS",
    label: "Finanzas",
    description: "Compras, ventas y balance operativo.",
  },
  {
    value: "SUPERADMIN",
    label: "Superadmin",
    description: "Acceso transversal a los modulos administrativos.",
  },
];

type FormState = {
  username: string;
  password: string;
  confirmPassword: string;
  role: InternalUserRole;
};

const initialState: FormState = {
  username: "",
  password: "",
  confirmPassword: "",
  role: "STOCK",
};

function getRoleLabel(role: InternalUserRole) {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-AR");
}

export function UserManagementWorkspace({ currentUsername }: { currentUsername: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [users, setUsers] = useState<InternalUserSummary[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<{
    username: string;
    role: InternalUserRole;
    createdAt: string;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [resetTargetId, setResetTargetId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const selectedRole = useMemo(
    () => roleOptions.find((option) => option.value === form.role) ?? roleOptions[0],
    [form.role],
  );

  const activeUsers = users.filter((user) => !user.mustChangePassword).length;
  const pendingUsers = users.filter((user) => user.mustChangePassword).length;
  const protectedUsers = users.filter((user) => user.isRootAdmin).length;

  async function loadUsers(showSkeleton = true) {
    if (showSkeleton) {
      setLoadingUsers(true);
    }

    try {
      const response = await getInternalUsers();
      setUsers(response.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los usuarios internos.",
      );
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("La confirmacion no coincide con la contrasena inicial.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contrasena inicial debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await registerInternalUser({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });

      setCreatedUser({
        username: response.data.username,
        role: response.data.role,
        createdAt: response.data.createdAt,
      });
      setSuccess(
        `El usuario ${response.data.username} fue creado. Debera iniciar sesion con la contrasena temporal y definir su clave personal en el primer acceso.`,
      );
      setForm(initialState);
      await loadUsers(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el usuario interno.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetInitialPassword(user: InternalUserSummary) {
    setError(null);
    setSuccess(null);

    if (resetPassword !== resetConfirmPassword) {
      setError("La confirmacion no coincide con la nueva contrasena inicial.");
      return;
    }

    if (resetPassword.length < 6) {
      setError("La nueva contrasena inicial debe tener al menos 6 caracteres.");
      return;
    }

    setActionLoadingId(user.id);

    try {
      const response = await resetInternalUserPassword(user.id, {
        password: resetPassword,
        confirmPassword: resetConfirmPassword,
      });

      setSuccess(
        `${response.data.username} recibio una nueva contrasena inicial y debera cambiarla en su proximo ingreso.`,
      );
      setResetTargetId(null);
      setResetPassword("");
      setResetConfirmPassword("");
      await loadUsers(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo restablecer la contrasena inicial.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteUser(user: InternalUserSummary) {
    setError(null);
    setSuccess(null);
    setActionLoadingId(user.id);

    try {
      await deleteInternalUser(user.id);
      setSuccess(`El usuario ${user.username} fue eliminado correctamente.`);
      setDeleteTargetId(null);
      if (createdUser?.username === user.username) {
        setCreatedUser(null);
      }
      await loadUsers(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo eliminar el usuario.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <AdminPage
      eyebrow="Accesos internos"
      title="Administrar usuarios internos"
      description="Cualquier sesion con rol SUPERADMIN puede registrar, revisar y gestionar cuentas internas. Cada usuario nuevo o reseteado queda obligado a cambiar su contrasena en el primer ingreso."
      actions={
        <div className="rounded-[1.4rem] border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Sesion superadmin</p>
          <p className="mt-2 font-semibold">{currentUsername}</p>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Usuarios totales" value={String(users.length)} />
        <AdminMetricCard label="Cuentas activas" value={String(activeUsers)} tone="success" />
        <AdminMetricCard label="Pendientes de cambio" value={String(pendingUsers)} tone="warning" />
        <AdminMetricCard label="Cuentas protegidas" value={String(protectedUsers)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel
          title="Nuevo usuario"
          description="Define el usuario, su rol operativo y la contrasena temporal que recibira para el primer ingreso."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Usuario</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, username: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  placeholder="usuario.interno"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Rol</label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, role: value as InternalUserRole }))
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 text-slate-900">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-sm text-slate-500">{selectedRole.description}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contrasena inicial
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  placeholder="Minimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirmar contrasena
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  placeholder="Repite la contrasena inicial"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500">
                Solo el usuario creado conocera su contrasena definitiva.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
              >
                <UserPlus2 size={16} />
                {submitting ? "Creando usuario..." : "Crear usuario"}
              </button>
            </div>
          </form>
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel
            title="Politica de acceso"
            description="Este modulo concentra altas y mantenimiento de cuentas sin tocar el esquema actual de la base."
          >
            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <ShieldCheck className="mt-0.5 text-cyan-700" size={18} />
                <p>Solo las sesiones con rol SUPERADMIN pueden entrar a esta pantalla y consumir estas APIs.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <KeyRound className="mt-0.5 text-cyan-700" size={18} />
                <p>Las contrasenas restablecidas vuelven a un estado inicial y fuerzan el cambio en el proximo inicio de sesion.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <UserCheck className="mt-0.5 text-cyan-700" size={18} />
                <p>La cuenta admin se muestra en el listado, pero queda protegida contra borrado o reseteo accidental.</p>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel
            title="Ultimo alta registrada"
            description="Referencia rapida del ultimo usuario creado en esta sesion."
          >
            {createdUser ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Usuario creado correctamente y pendiente de cambio de contrasena.
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Usuario</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{createdUser.username}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">Rol</p>
                  <p className="mt-2 font-medium">{getRoleLabel(createdUser.role)}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">Creado</p>
                  <p className="mt-2 font-medium">{formatDate(createdUser.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Todavia no generaste un usuario nuevo desde esta pantalla.
              </div>
            )}
          </AdminPanel>
        </div>
      </section>

      <AdminPanel
        title="Usuarios activos"
        description="Revisa el estado de cada cuenta interna, borra usuarios que ya no deban operar y redefine una contrasena inicial cuando necesites recuperar acceso."
      >
        {loadingUsers ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-5"
              >
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-3 w-64 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : users.length ? (
          <div className="max-h-[76svh] space-y-3 overflow-y-auto pr-1">
            {users.map((user) => {
              const protectedUser = user.isRootAdmin;
              const userActionRunning = actionLoadingId === user.id;
              const isResetting = resetTargetId === user.id;
              const isDeleting = deleteTargetId === user.id;

              return (
                <article
                  key={user.id}
                  className={`rounded-[1.5rem] border p-4 shadow-sm ${
                    protectedUser
                      ? "border-cyan-200 bg-cyan-50/70"
                      : "border-slate-200 bg-slate-50/80"
                  }`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-slate-950">{user.username}</p>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                          {getRoleLabel(user.role)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.mustChangePassword
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {user.mustChangePassword ? "Pendiente de cambio" : "Activa"}
                        </span>
                        {protectedUser ? (
                          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                            Cuenta protegida
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 2xl:grid-cols-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Creado
                          </p>
                          <p className="mt-1 font-medium text-slate-800">{formatDate(user.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Ultima actualizacion
                          </p>
                          <p className="mt-1 font-medium text-slate-800">{formatDate(user.updatedAt)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Estado de acceso
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {user.mustChangePassword
                              ? "Debe definir su clave personal"
                              : "Clave definitiva activa"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Cuenta
                          </p>
                          <p className="mt-1 font-medium text-slate-800">
                            {protectedUser ? "Raiz del sistema" : "Interna administrable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
                      <button
                        type="button"
                        disabled={protectedUser || userActionRunning}
                        onClick={() => {
                          setDeleteTargetId(null);
                          setResetTargetId((current) => (current === user.id ? null : user.id));
                          setResetPassword("");
                          setResetConfirmPassword("");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RefreshCcw size={15} />
                        Resetear clave
                      </button>
                      <button
                        type="button"
                        disabled={protectedUser || userActionRunning}
                        onClick={() => {
                          setResetTargetId(null);
                          setDeleteTargetId((current) => (current === user.id ? null : user.id));
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {protectedUser ? (
                    <div className="mt-4 rounded-2xl border border-cyan-200 bg-white/70 px-4 py-3 text-sm text-cyan-900">
                      La cuenta admin permanece visible para auditoria, pero no puede eliminarse ni recibir un reset de contrasena desde este panel.
                    </div>
                  ) : null}

                  {isResetting ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <KeyRound size={16} />
                        Definir nueva contrasena inicial para {user.username}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Nueva contrasena inicial
                          </label>
                          <input
                            type="password"
                            value={resetPassword}
                            onChange={(event) => setResetPassword(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                            placeholder="Minimo 6 caracteres"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Confirmar contrasena
                          </label>
                          <input
                            type="password"
                            value={resetConfirmPassword}
                            onChange={(event) => setResetConfirmPassword(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                            placeholder="Repite la nueva contrasena inicial"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setResetTargetId(null);
                            setResetPassword("");
                            setResetConfirmPassword("");
                          }}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={userActionRunning}
                          onClick={() => void handleResetInitialPassword(user)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
                        >
                          <KeyRound size={15} />
                          {userActionRunning ? "Guardando..." : "Guardar nueva inicial"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {isDeleting ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm font-semibold text-rose-900">
                        Vas a eliminar definitivamente a {user.username}.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-rose-700">
                        Esta accion quita el acceso al panel y no se puede deshacer desde esta pantalla.
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(null)}
                          className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={userActionRunning}
                          onClick={() => void handleDeleteUser(user)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
                        >
                          <Trash2 size={15} />
                          {userActionRunning ? "Eliminando..." : "Confirmar eliminacion"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            No hay usuarios internos cargados todavia.
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Users size={15} />
            Actualizar listado
          </button>
        </div>
      </AdminPanel>
    </AdminPage>
  );
}
