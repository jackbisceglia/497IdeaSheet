import { t } from "../trpc";
import { z } from "zod";

export const ideaRouter = t.router({
  getAllIdeas: t.procedure.query(({ ctx }) => {
    return ctx.prisma.idea.findMany({ orderBy: { createdAt: "desc" } });
  }),
  submitIdea: t.procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.description || !input.title) {
        return { error: "Missing title or description" };
      }

      return await ctx.prisma.idea.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
  deleteIdea: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const id = input;

    if (!input || !id) {
      return { error: "Missing idea id" };
    }

    const res = await ctx.prisma.idea.delete({ where: { id } });
    if (!res) {
      return { error: "Idea not found" };
    }

    return res;
  }),
});
