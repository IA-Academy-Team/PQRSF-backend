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
import sesionRoutes from "./sesion.routes";
import cuentaRoutes from "./cuenta.routes";
import verificacionRoutes from "./verificacion.routes";
import documentoRoutes from "./documento.routes";
import respuestaRoutes from "./respuesta.routes";
import encuestaRoutes from "./encuesta.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/pqrs", pqrsRoutes);
router.use("/analisis", analisisRoutes);
router.use("/reanalisis", reanalisisRoutes);
router.use("/notificaciones", notificacionRoutes);
router.use("/clientes", clienteRoutes);
router.use("/chats", chatRoutes);
router.use("/mensajes", mensajeRoutes);
router.use("/responsables", responsableRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/sesiones", sesionRoutes);
router.use("/cuentas", cuentaRoutes);
router.use("/verificaciones", verificacionRoutes);
router.use("/documentos", documentoRoutes);
router.use("/respuestas", respuestaRoutes);
router.use("/encuestas", encuestaRoutes);
router.use("/auth", authRoutes);

export default router;
