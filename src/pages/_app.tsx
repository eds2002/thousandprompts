import { type AppType } from "next/app";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Header from "~/components/global/Header";
import Footer from "~/components/global/Footer";
//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages: Array<string> = [
  "/",
  "/author/[...username]",
  "/journal/post/[postId]",
  "/author/[username]",
];

const MyApp: AppType = ({ Component, pageProps }) => {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);
  const { push } = useRouter();
  return (
    <ClerkProvider {...pageProps} navigate={(to) => push(to)}>
      {isPublicPage ? (
        <>
          <Component {...pageProps} />
        </>
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
      <Footer />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
