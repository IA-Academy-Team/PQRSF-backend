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
import authRoutes from "./auth.routes";
import rolRoutes from "./rol.routes";
import tipoPqrsRoutes from "./tipoPqrs.routes";
import estadoPqrsRoutes from "./estadoPqrs.routes";
import tipoDocumentoRoutes from "./tipoDocumento.routes";
import tipoPersonaRoutes from "./tipoPersona.routes";
import stakeholderRoutes from "./stakeholder.routes";
import areaRoutes from "./area.routes";
import clientsRoutes from "./clients.routes";
import pqrsfRoutes from "./pqrsf.routes";
import notificationsRoutes from "./notifications.routes";
import chatApiRoutes from "./chatApi.routes";
import dashboardRoutes from "./dashboard.routes";
import responsesRoutes from "./responses.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users/type-person", tipoPersonaRoutes);
router.use("/users/stake-holder", stakeholderRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolRoutes);
router.use("/type-pqrsf", tipoPqrsRoutes);
router.use("/pqrs-status", estadoPqrsRoutes);
router.use("/type-document", tipoDocumentoRoutes);
router.use("/area", areaRoutes);
router.use("/clients", clientsRoutes);
router.use("/pqrsf", pqrsfRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/chat", chatApiRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/responses", responsesRoutes);
router.use("/responsables", responsableRoutes);
router.use("/clientes", clienteRoutes);
router.use("/chats", chatRoutes);
router.use("/mensajes", mensajeRoutes);
router.use("/pqrs", pqrsRoutes);
router.use("/analisis", analisisRoutes);
router.use("/reanalisis", reanalisisRoutes);
router.use("/documentos", documentoRoutes);
router.use("/respuestas", respuestaRoutes);
router.use("/encuestas", encuestaRoutes);
router.use("/notificaciones", notificacionRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/sesiones", sesionRoutes);
router.use("/cuentas", cuentaRoutes);
router.use("/verificaciones", verificacionRoutes);

export default router;
