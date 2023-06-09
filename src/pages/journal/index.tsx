import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { DateTime } from "luxon";
import { api, type RouterOutputs } from "~/utils/api";

type AuthedUserPosts = RouterOutputs["posts"]["getUserPosts"][number];

const Post = (props: AuthedUserPosts) => {
  const ctx = api.useContext();
  const { mutate: DeletePost, isLoading: isDeleting } =
    api.posts.delete.useMutation({
      onSuccess: () => {
        void ctx.posts.getUserPosts.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          throw new Error(errorMessage[0]);
        } else {
          throw new Error("Failed to post! Please try again later");
        }
      },
    });

  return (
    <div className="w-screen max-w-[200px] rounded-xl bg-neutral-200 p-4">
      <p className="text-sm opacity-60">
        {DateTime.fromJSDate(props.createdAt).toFormat("DDD")}
      </p>
      <p className="text-xl font-semibold">{props.title}</p>
      <button
        onClick={() => DeletePost({ postId: props.id })}
        disabled={isDeleting}
        className="mt-4 w-full rounded-full bg-red-300 px-4 py-2"
      >
        {isDeleting ? "..." : "Delete"}
      </button>
    </div>
  );
};

const LoadingPosts = () => (
  <>
    <div className="w-screen max-w-[200px] rounded-xl bg-neutral-200 p-4">
      <p className="mr-auto flex w-24 animate-pulse items-start justify-start self-start rounded-full bg-white text-sm">
        &nbsp;
      </p>
      <p className="mt-1 w-14 rounded-full bg-white text-xl font-semibold">
        &nbsp;
      </p>
      <button className="mt-4 w-full animate-pulse rounded-full bg-red-300 px-4 py-2">
        &nbsp;
      </button>
    </div>
    <div className="w-screen max-w-[200px] rounded-xl bg-neutral-200 p-4">
      <p className="mr-auto flex w-24 animate-pulse items-start justify-start self-start rounded-full bg-white text-sm">
        &nbsp;
      </p>
      <p className="mt-1 w-14 rounded-full bg-white text-xl font-semibold">
        &nbsp;
      </p>
      <button className="mt-4 w-full animate-pulse rounded-full bg-red-300 px-4 py-2">
        &nbsp;
      </button>
    </div>
    <div className="w-screen max-w-[200px] rounded-xl bg-neutral-200 p-4">
      <p className="mr-auto flex w-24 animate-pulse items-start justify-start self-start rounded-full bg-white text-sm">
        &nbsp;
      </p>
      <p className="mt-1 w-14 rounded-full bg-white text-xl font-semibold">
        &nbsp;
      </p>
      <button className="mt-4 w-full animate-pulse rounded-full bg-red-300 px-4 py-2">
        &nbsp;
      </button>
    </div>
  </>
);

const JournalDashboard: NextPage = () => {
  const { isSignedIn, user } = useUser();

  const { data, isLoading, error } = api.posts.getUserPosts.useQuery();

  return (
    <>
      <Head>
        <title>My Journal</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto h-screen max-w-7xl px-6">
          <div className="grid h-full grid-cols-2 gap-6">
            <div className="h-full w-full rounded-xl bg-neutral-100 p-6">
              <p>My stats </p>
            </div>
            <div className="bg-neutral-100rounded-xl relative h-full w-full bg-neutral-100 p-6">
              <p>All my posts</p>
              <div className="relative space-y-6">
                {isLoading ? (
                  <LoadingPosts />
                ) : (
                  <>
                    {data?.length === 0 || !data ? (
                      <>
                        <p>No posts</p>
                      </>
                    ) : (
                      <>
                        {data.map((post) => (
                          <Post {...post} key={post.id} />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default JournalDashboard;
