import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
// import path from 'path';
import * as teamServices from "./../services/teamServices";
import { v2 as cloudinary } from "cloudinary";
import { Team } from "../types";

cloudinary.config({
  cloud_name: "dpjnmd62g",
  api_key: "415735428159965",
  api_secret: "Z3t_Aj_1PIjQ2V4owi6D2ocqMEg",
});

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const teams = await teamServices.getTeams();
    res.send(teams);
  } catch (error) {
    // Manejar el error
    res.status(500).send("Error al obtener equipos");
  }
  // res.send(teamServices.getTeams())
});

router.get("/:id", async (req, res) => {
  try {
    const team = await teamServices.getTeamById(req.params.id);

    if (team) {
      res.send(team);
    } else {
      res.status(404).send("Equipo no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al obtener equipo por id");
  }
  //   res.send(teamServices.getTeamById(req.params.id));
});

router.post("/", async (req, res) => {
  const id = req.body.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.json("No se subió un archivo");
  } else {
    const file: any = req.files.image;

    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      await fs.ensureDir(`${__dirname}/../../uploads/teams`);

      if (id === "default") {
        const filePath = `${__dirname}/../../uploads/teams/Default.png`;
        await file.mv(filePath, async (err: any) => {
          if (err) {
            res.json(`No se pudo subir el archivo, ${err}`);
          } else {
            const response = await cloudinary.uploader.upload(filePath);
            teamServices.addTeam({
              id,
              fullImage: {
                light: "",
              },
              miniImage: {
                light: response.secure_url,
              },
            });
            // driverServices.addDriver({
            //     id,
            //     image: response.secure_url
            // });

            res.json("Se ha subido el archivo Default");
          }
        });
      } else {
        const image = `${uuidv4()}.${file.mimetype.split("/")[1]}`;
        const filePath = `${__dirname}/../../uploads/teams/${image}`;
        await file.mv(filePath, async (err: any) => {
          if (err) {
            res.json(`No se pudo subir el archivo, ${err}`);
          } else {
            const response = await cloudinary.uploader.upload(filePath);
            const newTeam = teamServices.addTeam({
              id,
              fullImage: {
                light: "",
              },
              miniImage: {
                light: response.secure_url,
              },
            });

            res.json(newTeam);
          }
        });
      }
    } else {
      res.json("El archivo no es una imagen");
    }
  }
});

router.put("/", async (req, res) => {
  const { id, typeImage, theme } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.json("No se subió un archivo");
  } else {
    const file: any = req.files.image;

    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      const image = `${uuidv4()}.${file.mimetype.split("/")[1]}`;
      const filePath = `${__dirname}/../../uploads/teams/${image}`;

      // const team = (await teamServices.getTeamById(id)) as Team;
      // const teamKey = (await teamServices.getTeamNodeById(id)) as string;
      // team.miniImage.dark = "Hola";
      // const updateTeam = await teamServices.updateTeam(teamKey, team) as Team;

      // res.json(updateTeam);

      await fs.ensureDir(`${__dirname}/../../uploads/teams`);
      await file.mv(filePath, async (err: any) => {
        if (err) {
          res.json(`No se pudo subir el archivo, ${err}`);
        } else {
          const response = await cloudinary.uploader.upload(filePath);
          const team = (await teamServices.getTeamById(id)) as Team;
          const teamKey = (await teamServices.getTeamNodeById(id)) as string;
          if (typeImage === "fullImage") {
            if (theme === "light") {
              team ? (team.fullImage.light = response.secure_url) : "";
            } else if (theme === "dark") {
              team ? (team.fullImage.dark = response.secure_url) : "";
            }
          } else if (typeImage === "miniImage") {
            if (theme === "light") {
              team ? (team.miniImage.light = response.secure_url) : "";
            } else if (theme === "dark") {
              team ? (team.miniImage.dark = response.secure_url) : "";
            }
          }

          const updateTeam = (await teamServices.updateTeam(
            teamKey,
            team
          )) as Team;

          res.json(updateTeam);
        }
      });
    } else {
      res.json("El archivo no es una imagen");
    }
  }
});

router.get("/:id/image/:typeImage/:theme?", async (req, res) => {
  const { id, typeImage, theme } = req.params;

  try {
    const team = await teamServices.getTeamById(id);

    if (team) {
      let image;

      if (typeImage === "fullImage") {
        if (theme === "light" || theme === undefined) {
          image = team?.fullImage.light;
        } else if (theme === "dark") {
          if (team?.fullImage.dark === undefined) {
            image = team?.fullImage.light;
          } else {
            image = team?.fullImage.dark;
          }
        }
      } else if (typeImage === "miniImage") {
        if (theme === "light" || theme === undefined) {
          image = team?.miniImage.light;
        } else if (theme === "dark") {
          if (team?.miniImage.dark === undefined) {
            image = team?.miniImage.light;
          } else {
            image = team?.miniImage.dark;
          }
        }
      }
      res.redirect(image || "");
    } else {
      const def = (await teamServices.getTeamById("default")) as Team;
      res.redirect(def.miniImage.light);
    }
  } catch (error) {
    res.status(500).send("Error al obtener conductor por id");
  }

  // const pathImage = path.resolve(__dirname, `../../uploads/teams/${image}`);
  // // const pathImage = path.resolve(__dirname, `../../uploads/teams/${imageTeam}`);

  // if (fs.existsSync(pathImage)) {
  //   res.sendFile(pathImage);
  // } else {
  //   const pathNoImage = path.resolve(
  //     __dirname,
  //     "../../uploads/teams/Default.png"
  //   );
  //   res.sendFile(pathNoImage);
  // }
});

export default router;
