import express from 'express';
import multer from 'multer';
import userController from '../controllers/utenti.js';

const upload = multer();
const routerUser = express.Router();

routerUser.get('', userController.getUsers);
routerUser.get('/:id', userController.getUser);
routerUser.patch('/:id/authenticated', upload.none(),  userController.updateAuthStatusUser);

export default routerUser;
