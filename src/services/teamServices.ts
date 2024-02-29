import path from "path";
import fs from "fs-extra";

import { Team } from "../types";
import { db } from "../config";

const pathJSON = path.resolve(__dirname, "./teams.json");
let data: any = [];

if (!fs.existsSync(pathJSON)) {
  fs.writeJSON(`${__dirname}/teams.json`, []);
} else {
  data = fs.readJSONSync(`${__dirname}/teams.json`);
}

let teams: Team[] = data as Team[];

export const getTeams = async (): Promise<Team[]> => {
  const snapshot = await db.ref("teams").once("value");
  const teams: Team[] = snapshot.val();
  return teams;
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  try {
    const teamsRef = db.ref("teams");

    // Realiza la consulta para obtener el objeto con el id específico
    const snapshot = await teamsRef
      .orderByChild("id")
      .equalTo(id)
      .once("value");
    // Verifica si hay datos en el resultado
    if (snapshot.exists()) {
      const teamKey = Object.keys(snapshot.val())[0];
      // Obtiene el primer hijo (debería ser único porque estamos buscando por id)
      const team = snapshot.val()[teamKey] as Team;
      return team;
    } else {
      return null; // No se encontró ningúna escuderia con el id especificado
    }
  } catch (error) {
    // console.error('Error:', error);
    // Manejar el error
    throw error;
  }
};

export const getTeamNodeById = async (id: string): Promise<string | null> => {
  try {
    const teamsRef = db.ref("teams");

    // Realiza la consulta para obtener el objeto con el id específico
    const snapshot = await teamsRef
      .orderByChild("id")
      .equalTo(id)
      .once("value");
    // Verifica si hay datos en el resultado
    if (snapshot.exists()) {
      const teamKey = Object.keys(snapshot.val())[0];
      return teamKey;
    } else {
      return null; // No se encontró ningúna escuderia con el id especificado
    }
  } catch (error) {
    // console.error('Error:', error);
    // Manejar el error
    throw error;
  }
};

export const addTeam = (newTeamEntry: Team): Team => {
  const newTeam = {
    ...newTeamEntry,
  };

  db.ref("teams").push(newTeam);
  return newTeam;
};

export const updateTeam = async (idTeam: string, updateTeamEntry: Team): Promise<Team> => {
  try {
    const teamRef = db.ref(`teams/${idTeam}`);

    // Actualiza los datos del conductor con los nuevos datos proporcionados
    await teamRef.update(updateTeamEntry);
    return updateTeamEntry;
  } catch (error) {
    // Manejar el error
    throw error;
  }
  // teams = teamsUpdate;
  // fs.writeJSONSync(`${__dirname}/teams.json`, teamsUpdate);
};

export const getImage = (id: string): Team | undefined => {
  return teams.find((d) => d.id === id);
};
