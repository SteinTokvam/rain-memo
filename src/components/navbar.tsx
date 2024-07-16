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
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { setSession } from "@/actions/user";
import { routes } from "@/global";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Navbar = ({ supabase }: { supabase: SupabaseClient | null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = localStorage.getItem("sb-dezjrltoowqjcqiaqaog-auth-token");
  const lang = localStorage.getItem("i18nextLng") !== undefined ? localStorage.getItem("i18nextLng") : "gb";
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState(new Set([lang]));
  const languages = ["gb", "no"];
  const { t, i18n } = useTranslation();

  const selectedLanguage = useMemo(
    () => Array.from(selectedLanguageLabel).join(", ").replaceAll("_", " "),
    [selectedLanguageLabel]
  );

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
    window.localStorage.setItem('settings', JSON.stringify({ language: selectedLanguageLabel }))

  }, [selectedLanguage])

  const renderLanguageSelector = () => {
    return (
      <Select
        placeholder="language"
        className="w-16"
        variant="underlined"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-16",
          listboxWrapper: "max-h-[400px] w-16",
        }}
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-sm",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 border-none border-divider bg-background",
          },
        }}
        // @ts-ignore
        onSelectionChange={setSelectedLanguageLabel}
        // @ts-ignore
        selectedKeys={selectedLanguageLabel}
        selectorIcon={<></>}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-end gap-2">
              <Avatar alt="lang" className="flex-shrink-0" size="sm" src={`https://flagcdn.com/${item.key}.svg`} />
            </div>
          ));
        }}
      >
        {languages.map((lang) => (
          <SelectItem variant="flat" key={lang} value={lang} startContent={<Avatar alt="lang" className="w-6 h-6" src={`https://flagcdn.com/${lang}.svg`} />} />
        ))}
      </Select>
    )
  }

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
            <p className="font-bold text-inherit hidden sm:block">Rain memo</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          {
            renderLanguageSelector()
          }
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className={"hidden sm:flex"}>
          <Button
            aria-label="Login/Register"
            className={`${session ? "hidden " : ""}`}
            onClick={() => {
              navigate(routes.dashboard);
            }}
          >
            {t('login')}
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
        {
          renderLanguageSelector()
        }
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
