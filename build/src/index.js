"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const teams_1 = __importDefault(require("./routes/teams"));
const circuits_1 = __importDefault(require("./routes/circuits"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.get('/test', (_, res) => {
    res.send('App running');
});
app.use('/api/drivers', drivers_1.default);
app.use('/api/teams', teams_1.default);
app.use('/api/circuits', circuits_1.default);
app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});
