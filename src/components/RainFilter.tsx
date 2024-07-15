import { Button } from "@nextui-org/button";

import { FilterIcon } from "./icons";
import { useTranslation } from "react-i18next";

export default function RainFilter({
  handleClick,
}: {
  handleClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <Button
        startContent={<FilterIcon />}
        variant="light"
        onPress={handleClick}
      >
        {t('filter')}
      </Button>
    </div>
  );
}
