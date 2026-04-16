import { createApiHandler, parseBody, sendSuccess } from "@/lib/core/http";
import { vehicleCreateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import { createVehiculo, listVehiculos } from "@/lib/server/modules/vehiculos";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const vehiculos = await listVehiculos();
    return sendSuccess(res, vehiculos);
  },
  async POST(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const payload = parseBody(vehicleCreateSchema, req);
    const vehiculo = await createVehiculo(payload);
    return sendSuccess(res, vehiculo, { status: 201 });
  },
});
