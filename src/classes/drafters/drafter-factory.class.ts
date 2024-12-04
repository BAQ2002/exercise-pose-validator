import { Constructor, Exercise } from "../../types";
import PlankDrafter from "./plank-drafter.class";
import SidePlankDrafter from "./side-plank-drafter.class";
import Drafter from "./drafter.class";
import PushUpDrafter from "./push-up-drafter.class";
import SquatDrafter from "./squat-drafter.class";

export default class DrafterFactory {
  private static draftersDict: Record<Exercise, Constructor<Drafter>> = {
    squat: SquatDrafter,
    plank: PlankDrafter,
    push_up: PushUpDrafter,
    side_plank: SidePlankDrafter,
  };
  private static instance: DrafterFactory | undefined = undefined;

  private drafters: Record<string, Drafter>;

  private constructor() {
    this.drafters = {};
  }

  public static getInstance() {
    if (!DrafterFactory.instance) {
      DrafterFactory.instance = new DrafterFactory();
    }
    return DrafterFactory.instance;
  }

  public getDrafter(exercise: Exercise) {
    if (!this.drafters[exercise]) {
      this.drafters[exercise] = new DrafterFactory.draftersDict[exercise]();
    }
    return this.drafters[exercise];
  }
}
