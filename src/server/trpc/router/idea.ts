import { t } from "../trpc";
import { z } from "zod";

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const ideaRouter = t.router({
  getAllIdeas: t.procedure.query(({ ctx }) => {
    return ctx.prisma.idea.findMany({ orderBy: { rating: "desc" } });
  }),
  getIdeaNoteByIdea: t.procedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const res = await ctx.prisma.ideaNote.findMany({
        where: {
          ideaId: input,
        },
      });
      console.log(res);
    }),
  getIdeaBySlug: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    const res = await ctx.prisma.idea.findUnique({
      where: {
        slug: input,
      },
      include: {
        ideaNotes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return res;
  }),
  // getIdeaNoteById: t.procedure.input(z.string()).query(async ({ctx, input}) => {

  // }),
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
          slug: slugify(input.title),
        },
      });
    }),
  submitIdeaNote: t.procedure
    .input(
      z.object({
        message: z.string(),
        ideaId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input || !input.message) {
        return { error: "Missing title or description" };
      }

      return await ctx.prisma.ideaNote.create({
        data: {
          text: input.message,
          ideaId: input.ideaId,
        },
      });
    }),
  deleteIdea: t.procedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const id = input;

    if (!input || !id) {
      return { error: "Missing idea id" };
    }
    const deleteIdeaNotes = await ctx.prisma.ideaNote.deleteMany({
      where: {
        ideaId: id,
      },
    });
    const res = await ctx.prisma.idea.delete({ where: { id } });
    if (!res || deleteIdeaNotes) {
      return { error: "Idea not found" };
    }

    return res;
  }),
  rateIdea: t.procedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { type, id } = input;

      if (!input || !type || !["like", "dislike"].includes(type)) {
        return { error: "Missing idea id" };
      }

      const res = await ctx.prisma.idea.update({
        where: { id },
        data: {
          rating: type === "like" ? { increment: 1 } : { decrement: 1 },
        },
      });

      if (!res) {
        return { error: "Idea not found" };
      }

      return res;
    }),
});
