import express from 'express';
import multer from 'multer';
import sessioneController from '../controllers/sessioni.js';

const upload = multer();
const routerSessione = express.Router();

routerSessione.post('/new-session/:admin_id', upload.none(), sessioneController.creaNuovaSessione);
routerSessione.patch('/entra-sessione/:id_utente/:id_sessione', upload.none(), sessioneController.utenteEntraInSessione);
routerSessione.patch('/esce-sessione/:id_utente', upload.none(), sessioneController.utenteEsceDaSessione);
routerSessione.get('', sessioneController.getSessioni);
routerSessione.get('/:sessione_id', sessioneController.getSessione);

export default routerSessione
