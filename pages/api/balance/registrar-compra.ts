import {
  createApiHandler,
  parseBody,
  parseIdParam,
  sendEmpty,
  sendSuccess,
} from "@/lib/core/http";
import { legacyBalancePurchaseSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { deleteCompra, registerCompra } from "@/lib/server/modules/balance";

export default createApiHandler({
  async POST(req, res) {
    await requireApiRoles(req, ["FINANZAS", "SUPERADMIN"]);
    const payload = parseBody(legacyBalancePurchaseSchema, req);
    const item = await registerCompra(payload);
    return sendSuccess(res, item, { status: 201 });
  },
  async DELETE(req, res) {
    await requireApiRoles(req, ["FINANZAS", "SUPERADMIN"]);
    const id = parseIdParam(req);
    await deleteCompra(id);
    return sendEmpty(res);
  },
});
