import { Router } from 'express'
// imports de autenticacion
// imports de las rutas
import pqrsRoutes from "./pqrs.routes";
import analisisRoutes from "./analisis.routes";
import reanalisisRoutes from "./reanalisis.routes";
import notificacionRoutes from "./notificacion.routes";
import clienteRoutes from "./cliente.routes";
import chatRoutes from "./chat.routes";
import mensajeRoutes from "./mensaje.routes";
import responsableRoutes from "./responsable.routes";
import usuarioRoutes from "./usuario.routes";
import usersRoutes from "./users.routes";
import sesionRoutes from "./sesion.routes";
import cuentaRoutes from "./cuenta.routes";
import verificacionRoutes from "./verificacion.routes";
import documentoRoutes from "./documento.routes";
import respuestaRoutes from "./respuesta.routes";
import encuestaRoutes from "./encuesta.routes";
import surveyRoutes from "./survey.routes";
import authRoutes from "./auth.routes";
import rolRoutes from "./rol.routes";
import tipoPqrsRoutes from "./tipoPqrs.routes";
import estadoPqrsRoutes from "./estadoPqrs.routes";
import tipoDocumentoRoutes from "./tipoDocumento.routes";
import tipoPersonaRoutes from "./tipoPersona.routes";
import stakeholderRoutes from "./stakeholder.routes";
import areaRoutes from "./area.routes";
import pqrsfRoutes from "./pqrsf.routes";
import notificationsRoutes from "./notifications.routes";
import dashboardRoutes from "./dashboard.routes";
import responsesRoutes from "./responses.routes";
import webhooksRoutes from "./webhooks.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users/type-person", tipoPersonaRoutes);
// router.use("/users/stake-holder", stakeholderRoutes); // UNUSED (frontend)
router.use("/users", usersRoutes);
// router.use("/roles", rolRoutes); // UNUSED (frontend)
router.use("/type-pqrsf", tipoPqrsRoutes);
router.use("/pqrs-status", estadoPqrsRoutes);
router.use("/type-document", tipoDocumentoRoutes);
router.use("/area", areaRoutes);
router.use("/pqrsf", pqrsfRoutes);
// router.use("/notifications", notificationsRoutes); // UNUSED (frontend)
router.use("/dashboard", dashboardRoutes);
// router.use("/responses", responsesRoutes); // UNUSED (frontend)
router.use("/whatsapp", webhooksRoutes); // External integrations (not used by frontend)
router.use("/responsables", responsableRoutes);
// router.use("/clientes", clienteRoutes); // UNUSED (frontend)
router.use("/chats", chatRoutes);
router.use("/chat", chatRoutes);
// router.use("/mensajes", mensajeRoutes); // UNUSED (frontend)
// router.use("/pqrs", pqrsRoutes); // UNUSED (frontend) - frontend uses /pqrsf
// router.use("/analisis", analisisRoutes); // UNUSED (frontend) - frontend uses /pqrsf/analysis
router.use("/reanalisis", reanalisisRoutes); // UNUSED (frontend) - frontend uses /pqrsf/reanalysis
// router.use("/documentos", documentoRoutes); // UNUSED (frontend) - frontend uses /pqrsf/documents
// router.use("/respuestas", respuestaRoutes); // UNUSED (frontend) - frontend uses /pqrsf/responses
router.use("/encuestas", encuestaRoutes);
router.use("/survey", surveyRoutes);
router.use("/surver", surveyRoutes);
// router.use("/notificaciones", notificacionRoutes); // UNUSED (frontend)
// router.use("/usuarios", usuarioRoutes); // UNUSED (frontend)
// router.use("/sesiones", sesionRoutes); // UNUSED (frontend)
// router.use("/cuentas", cuentaRoutes); // UNUSED (frontend)
// router.use("/verificaciones", verificacionRoutes); // UNUSED (frontend)

export default router;
