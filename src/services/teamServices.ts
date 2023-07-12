import path from 'path';
import { Team } from '../types';
import fs from 'fs-extra';

const pathJSON = path.resolve(__dirname, './teams.json');
let data:any = [];

if (!fs.existsSync(pathJSON)) {
    fs.writeJSON(`${__dirname}/teams.json`, []);
} else {
    data = fs.readJSONSync(`${ __dirname }/teams.json`);
}

let teams: Team[] = data as Team[];

export const getTeams = (): Team[] => teams;

export const getTeamById = (id: string): Team | undefined => {
    return teams.find(d => d.id === id);
}

export const addTeam = (newTeamEntry: Team): Team => {
    const newTeam = {
        ...newTeamEntry
    }

    teams.push(newTeam);
    fs.writeJSONSync(`${ __dirname }/teams.json`, teams);
    return newTeam;
}

export const updateTeam = (updateTeamEntry: Team): Team => {
    const teamsUpdate = teams.map((team) =>
        team.id === updateTeamEntry.id
            ? { ...team }
            : team
    );

    teams = teamsUpdate;
    fs.writeJSONSync(`${ __dirname }/teams.json`, teamsUpdate);
    return updateTeamEntry;
}

export const getImage = (id: string): Team | undefined => {
    return teams.find(d => d.id === id);
}