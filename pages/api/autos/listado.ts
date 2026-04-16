import { createApiHandler, sendSuccess } from "@/lib/core/http";
import { requireApiRoles } from "@/lib/server/auth";
import { listAutosForSales } from "@/lib/server/modules/autos";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["FINANZAS", "SUPERADMIN"]);
    const autos = await listAutosForSales();
    return sendSuccess(res, autos);
  },
});
