import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

const axios = require("axios");
const sharp = require("sharp");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const secretString = process.env.SECRET_STRING;

app.use(morgan("dev"));
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.query.secret !== secretString) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

app.get("/image", async (req: Request, res: Response) => {
  const imageUrl = "https://i.imgur.com/RLob7UX.jpeg";

  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = imageResponse.data;

    const text = req.query.text || "No Text Provided";

    const metadata = await sharp(imageBuffer).metadata();
    const imageWidth = metadata.width;
    const imageHeight = metadata.height;

    const FONT_SIZE = (imageHeight * 16) / 300;

    const templateString = `<svg width="${imageWidth}" height="${imageHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .heavy { font: ${FONT_SIZE}px Arial; fill: white; text-anchor: middle; }
      </style>
      <text x="${imageWidth / 2}" y="${
      imageHeight / 2 + FONT_SIZE / 3
    }" class="heavy">${text}</text>
    </svg>`;

    const compositeImage = await sharp(imageBuffer)
      .jpeg({ mozjpeg: true })
      .composite([{ input: Buffer.from(templateString), gravity: "center" }])
      .toBuffer();

    res.contentType("image/png");
    res.send(compositeImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port);
console.log("Server is ", port);
