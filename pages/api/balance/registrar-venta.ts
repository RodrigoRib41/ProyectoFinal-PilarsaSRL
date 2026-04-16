import { createApiHandler, parseBody, sendSuccess } from "@/lib/core/http";
import { autoSaleSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { registrarVenta } from "@/lib/server/modules/balance";

export default createApiHandler({
  async POST(req, res) {
    await requireApiRoles(req, ["FINANZAS", "SUPERADMIN"]);
    const payload = parseBody(autoSaleSchema, req);
    const item = await registrarVenta(payload);
    return sendSuccess(res, item, { status: 201 });
  },
});
