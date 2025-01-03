import { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

import "./App.scss";
import { ExerciseValidation } from "./classes/validators/validator.class";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Exercise, exercisesTranslator } from "./types";

// source: https://www.flaticon.com/
import PlankImage from "./assets/plank.png";
import PushUpImage from "./assets/push-up.png";
import SquatImage from "./assets/squat.png";
import SidePlankImage from "./assets/side-plank.png";
import ValidatorFactory from "./classes/validators/validator-factory.class";
import DrafterFactory from "./classes/drafters/drafter-factory.class";
import { GitHub } from "@mui/icons-material";

function getScreenDim() {
  /*
  return {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
  };*/

  /*
  const minDimension = Math.min(window.innerWidth, window.innerHeight) - 10;
  return {
    width: minDimension,
    height: minDimension * (3 / 4),
  };*/

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

const exerciseImages: Record<Exercise, string> = {
  plank: PlankImage,
  squat: SquatImage,
  push_up: PushUpImage,
  side_plank: SidePlankImage,
};

function GlobalCircularProgress() {
  return (
    <div className="global-circular-progress">
      <CircularProgress size="10rem" />
    </div>
  );
}

type CameraComponentProps = {
  selectedExercise: Exercise;
  close: () => void;
};
function CameraComponent({ selectedExercise, close }: CameraComponentProps) {
  const [screenDim, setScreenDim] = useState(getScreenDim());
  const [isLoading, setIsLoading] = useState(true);
  // const [camera, setCamera] = useState<Camera | null | undefined>(undefined);
  const [exerciseValidation, setExcersiseValidation] =
    useState<ExerciseValidation | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null | undefined>(undefined);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // pose.onResults(onResults);
    pose.onResults((results) => {
      if (cameraRef.current === null) {
        return close();
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      setIsLoading(false);

      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      if (!results?.poseLandmarks || !results.poseWorldLandmarks) {
        setExcersiseValidation(null);
        return;
      }

      const drafterFactory = DrafterFactory.getInstance();
      const drafter = drafterFactory.getDrafter(selectedExercise);
      drafter.draw(results, canvas, ctx);

      const validatorFactory = ValidatorFactory.getInstance();
      const validator = validatorFactory.getValidator(selectedExercise);
      const res = validator.validate(results);
      setExcersiseValidation(res);
    });

    // Configurar a câmera
    const _camera = new Camera(videoRef.current, {
      facingMode: "environment",
      onFrame: async () => {
        await pose.send({ image: videoRef.current! });
      },
    });

    _camera.start();
    // setCamera(_camera);
    cameraRef.current = _camera;

    // Cleanup ao desmontar o componente
    return () => {
      // _camera.stop();
      pose.close();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const onResize = () => {
      setScreenDim(getScreenDim());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} muted />
      <canvas
        ref={canvasRef}
        width={screenDim.width}
        height={screenDim.height}
        style={{
          // border: "1px solid black",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />

      {isLoading ? (
        <GlobalCircularProgress />
      ) : (
        <div className="exercise-feedback-container">
          {(() => {
            let color = "";
            let message = "";
            if (!exerciseValidation) {
              color = "yellow";
              message = "Aguardando posição";
            } else if (!exerciseValidation.error) {
              color = "green";
              message = "Exercício correto!";
            } else {
              color = "red";
              message = exerciseValidation.error;
            }

            return <p style={{ color }}>{message}</p>;
          })()}

          <Button
            variant="contained"
            onClick={() => {
              if (process.env.REACT_APP_ENV === "dev") {
                alert(exerciseValidation?.points);
                alert(exerciseValidation?.angles);
              }
              cameraRef.current?.stop().then(() => {
                cameraRef.current = null;
              });
            }}
          >
            Fechar Câmera
          </Button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [selectedExercise, setSelecteExercise] = useState<Exercise>("plank");

  const selectedExerciseRef = useRef<Exercise>("plank");
  const isCameraOpenRef = useRef(isCameraOpen);

  useEffect(() => {
    selectedExerciseRef.current = selectedExercise;
    isCameraOpenRef.current = isCameraOpen;
  }, [selectedExercise, isCameraOpen]);

  useEffect(() => {
    const onResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-container">
      {!isCameraOpen && (
        <div className="select-exercise-container">
          <IconButton
            className="corner-icon"
            onClick={() => {
              window.open(
                "https://github.com/RafaSantos484/exercise-pose-validator"
              );
            }}
          >
            <GitHub />
          </IconButton>

          <h1>Validador de Exercícios</h1>

          <FormControl fullWidth sx={{ maxWidth: "350px" }}>
            <InputLabel id="select-exercise-label">Exercício</InputLabel>
            <Select
              labelId="select-exercise-label"
              value={selectedExercise}
              label="Exercício"
              onChange={(e) => {
                setSelecteExercise(e.target.value as Exercise);
              }}
            >
              {Object.entries(exercisesTranslator).map(
                ([excercise, translatedExercise]) => (
                  <MenuItem key={excercise} value={excercise}>
                    <div className="select-menu-item">
                      <span>{translatedExercise}</span>
                      <img
                        src={exerciseImages[excercise as Exercise]}
                        alt={translatedExercise}
                      />
                    </div>
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => setIsCameraOpen(true)}>
            Abrir Câmera
          </Button>
        </div>
      )}
      {isCameraOpen && (
        <CameraComponent
          selectedExercise={selectedExercise}
          close={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
}
