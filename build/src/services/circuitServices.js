"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.updateCircuit = exports.addCircuit = exports.getCircuitById = exports.getCircuits = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pathJSON = path_1.default.resolve(__dirname, './circuits.json');
let data = [];
if (!fs_extra_1.default.existsSync(pathJSON)) {
    fs_extra_1.default.writeJSON(`${__dirname}/circuits.json`, []);
}
else {
    data = fs_extra_1.default.readJSONSync(`${__dirname}/circuits.json`);
}
let circuits = data;
const getCircuits = () => circuits;
exports.getCircuits = getCircuits;
const getCircuitById = (id) => {
    return circuits.find(d => d.id === id);
};
exports.getCircuitById = getCircuitById;
const addCircuit = (newCircuitEntry) => {
    const newCircuit = Object.assign({}, newCircuitEntry);
    circuits.push(newCircuit);
    fs_extra_1.default.writeJSONSync(`${__dirname}/circuits.json`, circuits);
    return newCircuit;
};
exports.addCircuit = addCircuit;
const updateCircuit = (updateCircuitEntry) => {
    const circuitsUpdate = circuits.map((circuit) => circuit.id === updateCircuitEntry.id
        ? Object.assign(Object.assign({}, circuit), { image: updateCircuitEntry.image }) : circuit);
    circuits = circuitsUpdate;
    fs_extra_1.default.writeJSONSync(`${__dirname}/circuits.json`, circuitsUpdate);
    return updateCircuitEntry;
};
exports.updateCircuit = updateCircuit;
const getImage = (id) => {
    const circuit = circuits.find(d => d.id === id);
    return (circuit === null || circuit === void 0 ? void 0 : circuit.image) || undefined;
};
exports.getImage = getImage;
