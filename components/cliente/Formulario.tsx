"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { requestApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const contactReasons = ["Consulta", "Reclamo", "Service", "TestDrive"] as const;

const contactoSchema = z
  .object({
    motivo: z.string().min(1, "Selecciona un motivo."),
    nombre: z.string().trim().min(2, "Ingresa tu nombre."),
    apellido: z.string().trim().max(80).optional().default(""),
    email: z.string().trim().email("Ingresa un email valido."),
    telefono: z
      .string()
      .trim()
      .min(7, "Ingresa un telefono valido.")
      .max(30, "Ingresa un telefono valido."),
    modeloAuto: z.string().trim().max(80).optional().default(""),
    mensaje: z
      .string()
      .trim()
      .max(250, "Los comentarios no pueden superar los 250 caracteres.")
      .optional()
      .default(""),
  })
  .superRefine((data, context) => {
    if (data.motivo === "TestDrive") {
      if (data.modeloAuto.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modeloAuto"],
          message: "Indica el modelo que quieres probar.",
        });
      }

      return;
    }

    if (data.apellido.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["apellido"],
        message: "Ingresa tu apellido.",
      });
    }

    if (data.mensaje.length < 4) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mensaje"],
        message: "Describe un poco mejor tu consulta.",
      });
    }
  });

type ContactoFormData = z.input<typeof contactoSchema>;

function isTestDriveReason(value: string) {
  return value === "TestDrive";
}

export default function ContactoForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      motivo: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      modeloAuto: "",
      mensaje: "",
    },
  });

  const motivo = form.watch("motivo");
  const isTestDrive = isTestDriveReason(motivo);

  useEffect(() => {
    if (isTestDrive) {
      form.clearErrors(["apellido", "mensaje"]);
      return;
    }

    form.clearErrors(["modeloAuto"]);
  }, [form, isTestDrive]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payload = isTestDriveReason(data.motivo)
        ? {
            motivo: data.motivo,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            modeloAuto: data.modeloAuto ?? "",
            mensaje: data.mensaje ?? "",
          }
        : {
            motivo: data.motivo,
            nombre: data.nombre,
            apellido: data.apellido ?? "",
            email: data.email,
            telefono: data.telefono,
            mensaje: data.mensaje ?? "",
          };

      await requestApi("/api/envairEmail/enviar-email", {
        method: "POST",
        body: payload,
      });

      const confirmation = isTestDriveReason(data.motivo)
        ? "Solicitud de test drive enviada. Te contactaremos para coordinar el turno."
        : "Mensaje enviado correctamente.";

      setSuccessMessage(confirmation);
      toast.success(confirmation);
      form.reset();
    } catch (error) {
      setSuccessMessage(null);
      toast.error(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
    }
  });

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <CardHeader className="bg-slate-950 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
          Contacto directo
        </p>
        <CardTitle className="text-2xl sm:text-3xl">
          {isTestDrive ? "Coordinemos tu test drive" : "Conversemos sobre tu proximo paso"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-6 md:p-8">
        {successMessage ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Selecciona el motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={contactReasons[0]}>Consulta comercial</SelectItem>
                      <SelectItem value={contactReasons[1]}>Reclamo</SelectItem>
                      <SelectItem value={contactReasons[2]}>Service</SelectItem>
                      <SelectItem value={contactReasons[3]}>Test drive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isTestDrive ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Completa tus datos y el modelo que quieres probar. Los comentarios son
                opcionales.
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input className="rounded-2xl" placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isTestDrive ? (
                <FormField
                  control={form.control}
                  name="modeloAuto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo del auto</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-2xl"
                          placeholder="Ej. BAIC X55 Plus"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input className="rounded-2xl" placeholder="Apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-2xl"
                        type="email"
                        placeholder="Correo electronico"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input className="rounded-2xl" type="tel" placeholder="Telefono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mensaje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isTestDrive ? "Comentarios adicionales (opcional)" : "Mensaje"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 rounded-2xl"
                      placeholder={
                        isTestDrive
                          ? "Si quieres, puedes dejar una preferencia horaria o alguna duda extra."
                          : "Contanos que necesitas y te respondemos a la brevedad."
                      }
                      maxLength={250}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <span className="text-xs text-slate-400">
                      {(field.value ?? "").length}/250
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 py-6 text-sm font-semibold hover:bg-cyan-700"
            >
              {isTestDrive ? "Solicitar test drive" : "Enviar mensaje"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
