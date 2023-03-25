import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Button from "../ui/Button";
import LayoutWidth from "../ui/LayoutWidth";
import Image from "next/image";

export default function Header() {
  const links = ["Home", "New", "About us"];
  const { isSignedIn, user } = useUser();
  return (
    <header className="w-full py-3">
      <LayoutWidth className="flex items-center justify-between">
        <p className="flex-1 text-xl font-semibold">Logo</p>
        <nav className=" hidden flex-1 items-center justify-center md:flex">
          {links.map((link) => (
            <li
              className="mx-1 list-none whitespace-nowrap px-4 font-medium"
              key={link}
            >
              {link}
            </li>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-x-3">
          {isSignedIn ? (
            <Button href="/journal">
              <Image
                src={user.profileImageUrl}
                width={40}
                height={40}
                alt={`${user.username ?? "my"}'s profile image`}
                className="rounded-full"
              />
            </Button>
          ) : (
            <>
              <SignInButton />
              <Button className="rounded-full bg-black px-4 py-2 font-medium text-white">
                <SignUpButton />
              </Button>
            </>
          )}
        </div>
      </LayoutWidth>
    </header>
  );
}
