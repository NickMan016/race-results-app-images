import express from "express";
import cors from "cors";
import driverRouter from "./routes/drivers";
import teamRouter from "./routes/teams";
import circuitRouter from "./routes/circuits";
import fileUpload from "express-fileupload";

const PORT = process.env.PORT || 5000;
const allowedOrigins = ["https://race-results.netlify.app/"];
const localPort = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  cors({
    origin: function (origin, callback) {
      // Verificar si el origen está en la lista de permitidos o si es una solicitud de API
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (origin.startsWith("http://localhost:") &&
          origin.endsWith(`:${localPort}`))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/test", (_, res) => {
  res.send("App running");
});

app.use("/api/drivers", driverRouter);
app.use("/api/teams", teamRouter);
app.use("/api/circuits", circuitRouter);

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
