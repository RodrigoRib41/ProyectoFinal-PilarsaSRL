import { createApiHandler, parseQuery, sendSuccess } from "@/lib/core/http";
import { balanceFilterSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { listBalance } from "@/lib/server/modules/balance";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["FINANZAS", "SUPERADMIN"]);
    const filters = parseQuery(balanceFilterSchema, req);
    const items = await listBalance(filters);
    return sendSuccess(res, items);
  },
});
