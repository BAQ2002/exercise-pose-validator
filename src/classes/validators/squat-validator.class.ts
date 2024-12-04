import { LandmarkList, Results } from "@mediapipe/pose";
import Point3d from "../point3d.class";
import CoordinatesSystem from "../coordinates-system.class";
import Utils from "../utils.class";
import { landmarksDict } from "../../types";
import { ExerciseValidation, Validator } from "./validator.class";

export default class SquatValidator extends Validator {
  public validate(results: Results): ExerciseValidation {
    const landmarks = results.poseWorldLandmarks;
   
    //Pontos dos Ombros
    const LeftShoulderPoint = Utils.getLeftShoulderPoint(landmarks);
    const RightShoulderPoint = Utils.getRightShoulderPoint(landmarks);

    //Pontos do Quadril
    const LeftHipPoint = Utils.getLeftHipPoint(landmarks);
    const RightHipPoint = Utils.getRightHipPoint(landmarks);
    const hipMidPoint = Utils.getHipMidPoint(landmarks)
  
    //Pontos dos Joelhos
    const LeftKneePoint = Utils.getLeftKneePoint(landmarks);
    const RightKneePoint = Utils.getRightKneePoint(landmarks);

    //Pontos dos Calcanhares
    const LeftHeelPoint = Utils.getLeftHeelPoint(landmarks);
    const RightHeelPoint = Utils.getRightHeelPoint(landmarks);

    //Pontos dos Pés
    const LeftFootPoint = Utils.getLeftFootPoint(landmarks);
    const RightFootPoint = Utils.getRightFootPoint(landmarks);

    //Angulos//
    const LeftShoulderLeftKneeAngle = LeftShoulderPoint.getAngle2(LeftKneePoint); //Angulo Ombro esquerdo:Joelho
    const RightShoulderRightKneeAngle = RightShoulderPoint.getAngle2(RightKneePoint); //Angulo Ombro direito:Joelho

    const LeftKneeHipMidAngle = LeftKneePoint.getAngle2(hipMidPoint); //Angulo Joelho esquerdo:quadril
    const RightKneeHipMidAngle = RightKneePoint.getAngle2(hipMidPoint); //Angulo Joelho direito:quadril

    const LeftKneeLeftHeelAngle = LeftKneePoint.getAngle2(LeftHeelPoint); //Angulo Joelho e calcanhar esquerdo
    const RightKneeRightHeelAngle = RightKneePoint.getAngle2(RightHeelPoint); //Angulo Joelho e calcanhar direito

    const LeftKneeLeftFootAngle = LeftKneePoint.getAngle2(LeftFootPoint); //Angulo Joelho e pé esquerdo
    const RightKneeRightFootAngle = RightKneePoint.getAngle2(RightFootPoint); //Angulo Joelho e pé direito

    //const leftRightHipDiff = leftHipPoint.subtract(rightHipPoint);
    //const leftRightKneeDiff = leftKneePoint.subtract(rightKneePoint);
    //const leftRightHeelDiff = leftHeelPoint.subtract(rightHeelPoint);

    const response: ExerciseValidation = {
      error: "",
      points: [],
      angles: [
        LeftShoulderLeftKneeAngle,
        RightShoulderRightKneeAngle,
        LeftKneeHipMidAngle,
        RightKneeHipMidAngle,
        LeftKneeLeftHeelAngle,
        RightKneeRightHeelAngle,
        LeftKneeLeftFootAngle,
        RightKneeRightFootAngle,
        
      ],
    };
    

    if (
      LeftShoulderLeftKneeAngle > 135 || 
      RightShoulderRightKneeAngle > 135
    ){
      response.error = "Deixe os joelhos mais próximos da largura dos ombros";
    } 
    else if (
      LeftKneeLeftHeelAngle > 135 || 
      RightKneeRightHeelAngle > 135) 
    {
      response.error = "Deixe os pés mais próximos da largura dos joelhos ";
    } 
    else if (
      LeftKneeHipMidAngle > 10 || 
      RightKneeHipMidAngle > 10) 
    {
      response.error = "Continue agachando até uma maior profundamente";
    } 
    else if (
      Math.abs(90 - LeftKneeLeftFootAngle) > 30 || 
      Math.abs(90 - RightKneeRightFootAngle) > 30) 
      {
      response.error = "Alinhe os pés mais próximos da largura dos joelhos";
    } 
    return response;
  }
}
