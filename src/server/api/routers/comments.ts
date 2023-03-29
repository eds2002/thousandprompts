import clerkClient from "@clerk/clerk-sdk-node";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { User } from "@clerk/nextjs/dist/api";

const formatUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePic: user.profileImageUrl,
  };
};

export const commentsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        content: z
          .string({
            required_error: "You must write something in order to comment.",
          })
          .min(1)
          .max(255),
        username: z.string(),
        postId: z.string({
          required_error: "Must write something in order to post.",
        }),
        replyId: z.string().nullable(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          username: input.username,
          userId: input.userId,
          postId: input.postId,
          replyId: input.replyId,
        },
      });

      return comment;
    }),

  getByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        take: 100,
      });

      const users = await clerkClient.users.getUserList();

      const commentsWithUsers = comments.map((comment) => {
        const user = users.find((user) => user.id === comment.userId);
        return {
          ...comment,
          user: user ? formatUser(user) : null,
        };
      });

      return commentsWithUsers;
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
      return comment;
    }),
  edit: privateProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
      return comment;
    }),
});
