import { createApiHandler, parseBody, sendSuccess } from "@/lib/core/http";
import { repuestoCreateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { createRepuesto, listRepuestos } from "@/lib/server/modules/repuestos";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const repuestos = await listRepuestos();
    return sendSuccess(res, repuestos);
  },
  async POST(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const payload = parseBody(repuestoCreateSchema, req);
    const repuesto = await createRepuesto(payload);
    return sendSuccess(res, repuesto, { status: 201 });
  },
});
