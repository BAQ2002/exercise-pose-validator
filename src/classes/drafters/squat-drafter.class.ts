import { Results } from "@mediapipe/pose";
import Utils from "../utils.class";
import { landmarksDict } from "../../types";
import Drafter from "./drafter.class";

export default class SquatDrafter extends Drafter {
  constructor() {
    super([
      landmarksDict.LEFT_ELBOW,
      landmarksDict.RIGHT_ELBOW,
      landmarksDict.LEFT_SHOULDER,
      landmarksDict.RIGHT_SHOULDER,
      landmarksDict.LEFT_HIP,
      landmarksDict.RIGHT_HIP,
      landmarksDict.LEFT_KNEE,
      landmarksDict.RIGHT_KNEE,
      landmarksDict.LEFT_HEEL,
      landmarksDict.RIGHT_HEEL,
      landmarksDict.LEFT_FOOT_INDEX,
      landmarksDict.RIGHT_FOOT_INDEX,
    ]);
  }

  public draw(
    results: Results,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    super.draw(results, canvas, ctx);
    const landmarks = results.poseLandmarks;
    
    //Pontos dos Ombros
    const LeftShoulderPoint = Utils.getLeftShoulderPoint(landmarks);
    const RightShoulderPoint = Utils.getRightShoulderPoint(landmarks);
    //Pontos dos Pulsos
    const LeftWristPoint = Utils.getLeftWristPoint(landmarks);
    const RightWristPoint = Utils.getRightWristPoint(landmarks);
    //Ponto do Quadril
    const hipMidPoint = Utils.getHipMidPoint(landmarks)
    //Pontos dos Joelhos
    const LeftKneePoint = Utils.getLeftKneePoint(landmarks);
    const RightKneePoint = Utils.getRightKneePoint(landmarks);
    //Pontos dos Calcanhares
    const LeftHeelPoint = Utils.getLeftHeelPoint(landmarks);
    const RighHeelPoint = Utils.getRightHeelPoint(landmarks);
    //Pontos dos Pés
    const LeftFootPoint = Utils.getLeftFootPoint(landmarks);
    const RightFootPoint = Utils.getRightFootPoint(landmarks);
    const FootMidPoint = Utils.getFootIndexesMidPoint(landmarks);

    this.drawLine(canvas, ctx, LeftShoulderPoint, LeftWristPoint); //Distancia Esquerda: Ombro/Pulso
    this.drawLine(canvas, ctx, RightShoulderPoint, RightWristPoint); //Distancia Direita: Ombro/Pulso

    this.drawLine(canvas, ctx, LeftShoulderPoint, LeftKneePoint); //Distancia Esquerda: Ombro/Joelho
    this.drawLine(canvas, ctx, RightShoulderPoint, RightKneePoint); //Distancia Direita: Ombro/Joelho
    
    this.drawLine(canvas, ctx, hipMidPoint, FootMidPoint); //Distancia: Quadril/Pés

    this.drawLine(canvas, ctx, LeftKneePoint, LeftFootPoint); //Distancia Esquerda: Joelho/Pé
    this.drawLine(canvas, ctx, RightKneePoint, RightFootPoint); //Distancia Direita: Joelho/Pé


  }
}
