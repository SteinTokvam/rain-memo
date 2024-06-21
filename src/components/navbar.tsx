import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SupabaseClient } from "@supabase/supabase-js";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { Logo } from "@/components/icons";
import { setSession } from "@/actions/user";
import { routes } from "@/global";

export const Navbar = ({ supabase }: { supabase: SupabaseClient | null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = localStorage.getItem("sb-dezjrltoowqjcqiaqaog-auth-token");

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href={session ? routes.dashboard : routes.home}
          >
            <Logo />
            <p className="font-bold text-inherit">Rain memo</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className={"hidden sm:flex"}>
          <Button
            className={`${session ? "hidden " : ""}`}
            onClick={() => {
              navigate(routes.dashboard);
            }}
          >
            Logg inn/Registrer deg
          </Button>
          <Button
            className={`${!session ? "hidden " : ""}text-sm font-normal text-default-600 bg-default-100`}
            color="danger"
            variant="flat"
            onClick={() => {
              supabase &&
                supabase.auth.signOut().then(() => {
                  dispatch(setSession(null));
                  navigate(routes.home);
                });
            }}
          >
            Logg ut
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarItem className="flex">
          <Button
            className={`${session ? "hidden " : ""}`}
            variant="flat"
            onClick={() => {
              navigate(routes.dashboard);
            }}
          >
            Logg inn
          </Button>
          <Button
            className={`${!session ? "hidden " : ""}text-sm font-normal text-default-600 bg-default-100`}
            color="danger"
            variant="flat"
            onClick={() => {
              supabase &&
                supabase.auth.signOut().then(() => {
                  dispatch(setSession(null));
                  navigate(routes.home);
                });
            }}
          >
            Logg ut
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
