"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.updateDriver = exports.addDriver = exports.getDriverById = exports.getDrivers = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pathJSON = path_1.default.resolve(__dirname, './drivers.json');
let data = [];
if (!fs_extra_1.default.existsSync(pathJSON)) {
    fs_extra_1.default.writeJSON(`${__dirname}/drivers.json`, []);
}
else {
    data = fs_extra_1.default.readJSONSync(`${__dirname}/drivers.json`);
}
let drivers = data;
const getDrivers = () => drivers;
exports.getDrivers = getDrivers;
const getDriverById = (id) => {
    return drivers.find(d => d.id === id);
};
exports.getDriverById = getDriverById;
const addDriver = (newDriverEntry) => {
    const newDriver = Object.assign({}, newDriverEntry);
    drivers.push(newDriver);
    fs_extra_1.default.writeJSONSync(`${__dirname}/drivers.json`, drivers);
    return newDriver;
};
exports.addDriver = addDriver;
const updateDriver = (updateDriverEntry) => {
    const driversUpdate = drivers.map((driver) => driver.id === updateDriverEntry.id
        ? Object.assign(Object.assign({}, driver), { image: updateDriverEntry.image }) : driver);
    drivers = driversUpdate;
    fs_extra_1.default.writeJSONSync(`${__dirname}/drivers.json`, driversUpdate);
    return updateDriverEntry;
};
exports.updateDriver = updateDriver;
const getImage = (id) => {
    const driver = drivers.find(d => d.id === id);
    return (driver === null || driver === void 0 ? void 0 : driver.image) || undefined;
};
exports.getImage = getImage;
