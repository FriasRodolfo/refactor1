import GuideArrowOverlay from "@/components/GuideArrows";
import GuideModal, { GuideStep } from "@/components/GuideModal";

interface GuideLayerProps {
  guideActive: boolean;
  currentSteps: GuideStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export default function GuideLayer({
  guideActive,
  currentSteps,
  currentStepIndex,
  onNext,
  onPrev,
  onClose,
}: GuideLayerProps) {
  if (!guideActive || currentSteps.length === 0) {
    return null;
  }

  return (
    <>
      <GuideArrowOverlay
        activeKey={currentSteps[currentStepIndex].targetKey}
        placement={currentSteps[currentStepIndex].placement}
      />
      <GuideModal
        isOpen={guideActive}
        step={currentSteps[currentStepIndex]}
        currentStepIndex={currentStepIndex}
        totalSteps={currentSteps.length}
        onNext={onNext}
        onPrev={onPrev}
        onClose={onClose}
      />
    </>
  );
}
