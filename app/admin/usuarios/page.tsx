import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserManagementWorkspace } from "@/components/admin/workspaces/UserManagementWorkspace";
import { authOptions } from "@/lib/auth/options";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username ?? session?.user?.name;

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/auth/unauthorized");
  }

  return <UserManagementWorkspace currentUsername={username ?? "superadmin"} />;
}
