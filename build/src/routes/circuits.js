"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const circuitServices = __importStar(require("../services/circuitServices"));
const router = express_1.default.Router();
router.get('/', (_, res) => {
    res.send(circuitServices.getCircuits());
});
router.get('/:id', (req, res) => {
    res.send(circuitServices.getCircuitById(req.params.id));
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    }
    else {
        const file = req.files.image;
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            const image = `${(0, uuid_1.v4)()}.${file.mimetype.split('/')[1]}`;
            yield fs_extra_1.default.ensureDir(`${__dirname}/../../uploads/circuits`);
            yield file.mv(`${__dirname}/../../uploads/circuits/${image}`, (err) => {
                if (err) {
                    res.json(`No se pudo subir el archivo, ${err}`);
                }
                else {
                    const newCircuit = circuitServices.addCircuit({
                        id,
                        image
                    });
                    res.json(newCircuit);
                }
            });
        }
        else {
            res.json('El archivo no es una imagen');
        }
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    }
    else {
        const file = req.files.image;
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            const image = `${(0, uuid_1.v4)()}.${file.mimetype.split('/')[1]}`;
            yield fs_extra_1.default.ensureDir(`${__dirname}/../../uploads/circuits`);
            yield file.mv(`${__dirname}/../../uploads/circuits/${image}`, (err) => {
                if (err) {
                    res.json(`No se pudo subir el archivo, ${err}`);
                }
                else {
                    const updateCircuit = circuitServices.updateCircuit({
                        id,
                        image
                    });
                    res.json(updateCircuit);
                }
            });
        }
        else {
            res.json('El archivo no es una imagen');
        }
    }
}));
router.get('/:id/image', (req, res) => {
    const { id } = req.params;
    const imageCircuit = circuitServices.getImage(id);
    const pathImage = path_1.default.resolve(__dirname, `../../uploads/circuits/${imageCircuit}`);
    if (fs_extra_1.default.existsSync(pathImage)) {
        res.sendFile(pathImage);
    }
    else {
        const pathNoImage = path_1.default.resolve(__dirname, '../../uploads/circuits/Default.png');
        res.sendFile(pathNoImage);
    }
});
exports.default = router;
