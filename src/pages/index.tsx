import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Button from "~/components/ui/Button";
import LayoutWidth from "~/components/ui/LayoutWidth";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { isSignedIn } = useUser();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen ">
        <LayoutWidth>
          <div className="mt-2 grid h-[85%] grid-cols-1   gap-x-4">
            <div className="col-span-1 flex flex-col  rounded-xl ">
              <div className="relative flex-1 rounded-3xl bg-neutral-400">
                {/* IMAGE */}
                <div className="absolute bottom-4 left-4 flex flex-col items-start">
                  <Button
                    style="outline"
                    className="cursor-auto py-1 font-medium"
                  >
                    Topic
                  </Button>
                  <Button className="mt-2 cursor-auto rounded-full  bg-white px-4 py-1 font-medium">
                    Month D, Year
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </LayoutWidth>
      </main>
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main> */}
    </>
  );
};

export default Home;
