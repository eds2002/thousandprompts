import { users } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateBio: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        publicMetaData: z.object({
          bannerURL: z.string(),
          bio: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const addBio = await users.updateUser(input.userId, {
        publicMetadata: input.publicMetaData,
      });
      return addBio;
    }),

  updateBanner: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        publicMetaData: z.object({
          bannerURL: z.string(),
          bio: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const bannerImage = await users.updateUser(input.userId, {
        publicMetadata: input.publicMetaData,
      });
      return bannerImage;
    }),
});
