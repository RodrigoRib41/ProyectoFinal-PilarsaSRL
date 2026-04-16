import { createApiHandler, parseBody, sendSuccess } from "@/lib/core/http";
import { serviceCreateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { createService, listServices } from "@/lib/server/modules/services";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const services = await listServices();
    return sendSuccess(res, services);
  },
  async POST(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const payload = parseBody(serviceCreateSchema, req);
    const service = await createService(payload);
    return sendSuccess(res, service, { status: 201 });
  },
});
