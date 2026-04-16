import {
  createApiHandler,
  parseBody,
  parseIdParam,
  sendEmpty,
  sendSuccess,
} from "@/lib/core/http";
import { repuestoUpdateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import {
  deleteRepuesto,
  updateRepuesto,
} from "@/lib/server/modules/repuestos";

export default createApiHandler({
  async PUT(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    const payload = parseBody(repuestoUpdateSchema, req);
    const repuesto = await updateRepuesto(id, payload);
    return sendSuccess(res, repuesto);
  },
  async DELETE(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    await deleteRepuesto(id);
    return sendEmpty(res);
  },
});
