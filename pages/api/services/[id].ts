import {
  createApiHandler,
  parseBody,
  parseIdParam,
  sendEmpty,
  sendSuccess,
} from "@/lib/core/http";
import { serviceUpdateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import {
  deleteService,
  updateService,
} from "@/lib/server/modules/services";

export default createApiHandler({
  async PUT(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    const payload = parseBody(serviceUpdateSchema, req);
    const service = await updateService(id, payload);
    return sendSuccess(res, service);
  },
  async DELETE(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    await deleteService(id);
    return sendEmpty(res);
  },
});
