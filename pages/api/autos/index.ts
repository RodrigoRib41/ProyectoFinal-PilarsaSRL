import type { NextApiRequest } from "next";
import { createApiHandler, sendSuccess } from "@/lib/core/http";
import { requireApiRoles } from "@/lib/server/auth";
import { createAuto, listAutos } from "@/lib/server/modules/autos";
import { parseMultipartForm } from "@/lib/server/formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createApiHandler({
  async GET(_req, res) {
    const autos = await listAutos();
    return sendSuccess(res, autos);
  },
  async POST(req, res) {
    await requireApiRoles(req, ["STOCK", "SUPERADMIN"]);
    const { fields, files } = await parseMultipartForm(req as NextApiRequest);
    const auto = await createAuto({ fields, files });
    return sendSuccess(res, auto, { status: 201 });
  },
});
