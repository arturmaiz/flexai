import type { Exercise } from "@/app/workout/new/types";

export const parseWorkoutPlanText = (
  text: string
): { introText: string; exercises: Exercise[] } => {
  const exerciseBlocks = text.split("---").filter((block) => block.trim());
  const parsedExercises: Exercise[] = [];
  let intro = "";

  exerciseBlocks.forEach((block, index) => {
    const exerciseMatch = block.match(/EXERCISE:\s*(.+)/i);
    const setsMatch = block.match(/SETS:\s*(.+)/i);
    const repsMatch = block.match(/REPS:\s*(.+)/i);
    const videoMatch = block.match(/VIDEO:\s*(.+)/i);

    if (exerciseMatch && setsMatch && repsMatch && videoMatch) {
      parsedExercises.push({
        name: exerciseMatch[1].trim(),
        sets: setsMatch[1].trim(),
        reps: repsMatch[1].trim(),
        videoUrl: videoMatch[1].trim(),
      });
    } else if (index === 0) {
      intro = block.trim();
    }
  });

  const derivedIntro = intro || text.split("EXERCISE:")[0] || text;
  return { introText: derivedIntro, exercises: parsedExercises };
};
