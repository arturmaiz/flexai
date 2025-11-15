import z from "zod";

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter your full name.",
  }),
  age: z.number().min(1, {
    message: "Please enter your age.",
  }),
  workoutGoal: z.string().min(5, {
    message: "Please enter your workout goal (at least 5 characters).",
  }),
});
