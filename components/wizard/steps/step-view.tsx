"use client";
import { useCurrentStep } from "../wizard-shell";
import { BusinessStep } from "./business-step";
import { GoalStep, NicheStep } from "./niche-goal-steps";
import { HookStep } from "./hook-step";
import { ScriptStep } from "./script-step";
import { MusicStep, StyleStep, VoiceStep } from "./style-voice-music";
import { PreviewStep } from "./preview-step";

/** Renders one of the 9 wizard steps (Part 03 §6.1–§6.9). */
export function WizardStepView() {
  const step = useCurrentStep();
  return <StepSwitch step={step} />;
}

function StepSwitch({ step }: { step: ReturnType<typeof useCurrentStep> }) {
  switch (step) {
    case "business": return <BusinessStep />;
    case "niche": return <NicheStep />;
    case "goal": return <GoalStep />;
    case "hook": return <HookStep />;
    case "script": return <ScriptStep />;
    case "style": return <StyleStep />;
    case "voice": return <VoiceStep />;
    case "music": return <MusicStep />;
    case "preview": return <PreviewStep />;
  }
}
