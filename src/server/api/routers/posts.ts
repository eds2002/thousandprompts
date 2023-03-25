import clerkClient from "@clerk/clerk-sdk-node";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { User } from "@clerk/nextjs/dist/api";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const formatUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePic: user.profileImageUrl,
    joinedDate: user.createdAt,
  };
};

export const postsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        title: z
          .string({
            required_error: "Title is required",
          })
          .min(8)
          .max(250),
        content: z.string({
          required_error: "Must write something in order to post.",
        }),
        published: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      // const { success } = await ratelimit.limit(authorId);

      // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
          title: input.title,
          published: true,
        },
      });

      return post;
    }),
  getUserPosts: privateProcedure.query(async ({ ctx }) => {
    const allPostsById = await ctx.prisma.post.findMany({
      where: {
        authorId: ctx.userId,
      },
    });

    return allPostsById;
  }),
  delete: privateProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletePost = await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
      return deletePost;
    }),
  getAllByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [findUser] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!findUser) throw new TRPCError({ code: "NOT_FOUND" });

      const formatedUser = formatUser(findUser);
      const userPosts = await ctx.prisma.post.findMany({
        where: {
          authorId: formatedUser?.id,
        },
      });

      return {
        formatedUser: formatedUser,
        userPosts: userPosts,
      };
    }),
  getById: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userPost = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
      if (!userPost) throw new TRPCError({ code: "NOT_FOUND" });

      const [userData] = await clerkClient.users.getUserList({
        userId: [userPost.authorId],
      });

      if (!userData) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        user: formatUser(userData),
        post: userPost,
      };
    }),
});
