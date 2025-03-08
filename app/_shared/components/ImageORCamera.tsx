"use client";

import { useState } from "react";

import Image from "next/image";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import imageCompression from "browser-image-compression";
import Paper from "@mui/material/Paper";

import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Props {
  setImage: (image: string) => void;
  image: string;
  setAttachedFile: (file: File | null) => void;
  attachedFile: File | null;
}

const ImageORCamera = ({
  setImage,
  image,
  setAttachedFile,
  attachedFile,
}: Props) => {
  const [type, setType] = useState<string>("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files || !e.target.files.length) {
      return;
    }

    setImage("");

    const file = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setAttachedFile(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        {!type && (
          <Grid item xs={12} sm={12} md={12}>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button
                startIcon={<PhotoCameraIcon />}
                onClick={() => {
                  setType("camera");
                  setImage("");
                  setAttachedFile(null);
                }}
              >
                Capturar evidencia
              </Button>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                endIcon={<AttachFileIcon />}
              >
                Adjuntar imagen
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>
            </ButtonGroup>
          </Grid>
        )}

        {type === "camera" && (
          <Grid item xs={12} sm={12} md={12}>
            <Camera
              onTakePhoto={(dataUri) => {
                setImage(dataUri);
                setType("");
              }}
              idealFacingMode={FACING_MODES.ENVIRONMENT}
            />
          </Grid>
        )}
      </Grid>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 1 }}
      >
        {image && (
          <Grid item xs={12} sm={12} md={12}>
            <Paper>
              <Image
                src={image}
                alt="Hallazgo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
              />
            </Paper>
          </Grid>
        )}
        {attachedFile && (
          <Grid item xs={12} md={12} sm={3}>
            <Paper>
              <div
                style={{
                  display: "grid",
                  gridGap: "8px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, auto))",
                }}
              >
                <div style={{ position: "relative", height: "400px" }}>
                  <Image
                    alt="Mountains"
                    src={URL.createObjectURL(attachedFile)}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ImageORCamera;
