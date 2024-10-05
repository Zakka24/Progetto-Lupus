import express from 'express';
import multer from 'multer';
import roleController from '../controllers/ruoli.js';

const upload = multer();
const routerRoles = express.Router();

routerRoles.get('', roleController.getRoles);
routerRoles.post('', upload.none(), roleController.newRuolo);
routerRoles.patch('/:id', upload.none(), roleController.updateAttributes);
routerRoles.delete('/:id', roleController.deleteRuolo);

export default routerRoles