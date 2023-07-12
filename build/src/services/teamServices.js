"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.updateTeam = exports.addTeam = exports.getTeamById = exports.getTeams = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pathJSON = path_1.default.resolve(__dirname, './teams.json');
let data = [];
if (!fs_extra_1.default.existsSync(pathJSON)) {
    fs_extra_1.default.writeJSON(`${__dirname}/teams.json`, []);
}
else {
    data = fs_extra_1.default.readJSONSync(`${__dirname}/teams.json`);
}
let teams = data;
const getTeams = () => teams;
exports.getTeams = getTeams;
const getTeamById = (id) => {
    return teams.find(d => d.id === id);
};
exports.getTeamById = getTeamById;
const addTeam = (newTeamEntry) => {
    const newTeam = Object.assign({}, newTeamEntry);
    teams.push(newTeam);
    fs_extra_1.default.writeJSONSync(`${__dirname}/teams.json`, teams);
    return newTeam;
};
exports.addTeam = addTeam;
const updateTeam = (updateTeamEntry) => {
    const teamsUpdate = teams.map((team) => team.id === updateTeamEntry.id
        ? Object.assign({}, team) : team);
    teams = teamsUpdate;
    fs_extra_1.default.writeJSONSync(`${__dirname}/teams.json`, teamsUpdate);
    return updateTeamEntry;
};
exports.updateTeam = updateTeam;
const getImage = (id) => {
    return teams.find(d => d.id === id);
};
exports.getImage = getImage;
