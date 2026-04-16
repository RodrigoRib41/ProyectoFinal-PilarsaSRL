import {
  createApiHandler,
  parseBody,
  parseIdParam,
  sendEmpty,
  sendSuccess,
} from "@/lib/core/http";
import { vehicleUpdateSchema } from "@/lib/domain/schemas";
import { requireApiRoles } from "@/lib/server/auth";
import {
  deleteVehiculo,
  getVehiculoById,
  updateVehiculo,
} from "@/lib/server/modules/vehiculos";

export default createApiHandler({
  async GET(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    const vehiculo = await getVehiculoById(id);
    return sendSuccess(res, vehiculo);
  },
  async PUT(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    const payload = parseBody(vehicleUpdateSchema, req);
    const vehiculo = await updateVehiculo(id, payload);
    return sendSuccess(res, vehiculo);
  },
  async DELETE(req, res) {
    await requireApiRoles(req, ["SERVICES", "SUPERADMIN"]);
    const id = parseIdParam(req);
    await deleteVehiculo(id);
    return sendEmpty(res);
  },
});
