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
    username: user.username ?? "",
    profilePic: user.profileImageUrl,
    joinedDate: user.createdAt,
    bannerImage: user.publicMetadata.bannerURL as string | null,
    bio: user.publicMetadata.bio as string | null,
  };
};

const addUserToPost = (posts: Post[], users: User[]) => {
  return posts.map((post) => {
    const user = users.find((user) => user.id === post.authorId);
    if (user) {
      return {
        ...post,
        username: user.username,
        profilePic: user.profileImageUrl,
      };
    }
  });
};

export const postsRouter = createTRPCRouter({
  edit: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        title: z
          .string({
            required_error: "Title is required",
          })
          .min(1)
          .max(64),
        content: z.string({
          required_error: "Must write something in order to post.",
        }),
        published: z.boolean(),
        imageUrl: z.string({
          required_error: "An image is required.",
        }),
        redirectToPreview: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          title: input.title,
          content: input.content,
          published: input.published,
          imageUrl: input.imageUrl,
        },
      });

      return { ...post, redirectToPreview: input.redirectToPreview };
    }),
  create: privateProcedure
    .input(
      z.object({
        title: z
          .string({
            required_error: "Title is required",
          })
          .min(1)
          .max(64),
        content: z.string({
          required_error: "Must write something in order to post.",
        }),
        published: z.boolean(),
        imageUrl: z.string({
          required_error: "An image is required.",
        }),
        redirectToPreview: z.boolean(),
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
          imageUrl: input.imageUrl,
        },
      });

      return { ...post, redirectToPreview: input.redirectToPreview };
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
    .input(z.object({ postId: z.string() }))
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
    .input(z.object({ postId: z.string() }))
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

      return {
        user: formatUser(userData!),
        post: userPost,
      };
    }),
  getPosts: publicProcedure
    .input(z.object({ amount: z.number().nullable() }))
    .query(async ({ ctx, input }) => {
      const allPosts = await ctx.prisma.post.findMany({
        where: {
          published: true,
        },
        take: input.amount ?? 50,
      });

      const users = await clerkClient.users.getUserList();

      return addUserToPost(allPosts, users);
    }),
});
