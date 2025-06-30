-- CreateTable
CREATE TABLE "Repuesto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicioRepuesto" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ServicioRepuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repuesto_codigo_key" ON "Repuesto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ServicioRepuesto_serviceId_repuestoId_key" ON "ServicioRepuesto"("serviceId", "repuestoId");

-- AddForeignKey
ALTER TABLE "ServicioRepuesto" ADD CONSTRAINT "ServicioRepuesto_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicioRepuesto" ADD CONSTRAINT "ServicioRepuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "Repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
