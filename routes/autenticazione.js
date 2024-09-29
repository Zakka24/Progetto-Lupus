import express from 'express';
import multer from 'multer';
import authController from '../controllers/autenticazione.js';

const upload = multer();
const routerAuth = express.Router();

routerAuth.post('/register', upload.none(), authController.register);
routerAuth.post('/login',upload.none(),authController.login);
routerAuth.post('/logout/:username', upload.none(), authController.logout);

export default routerAuth
