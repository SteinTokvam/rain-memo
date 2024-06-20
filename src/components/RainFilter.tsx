import { Button } from "@nextui-org/button";

import { FilterIcon } from "./icons";

export default function RainFilter({
  handleClick,
}: {
  handleClick: () => void;
}) {
  return (
    <div>
      <Button
        startContent={<FilterIcon />}
        variant="light"
        onPress={handleClick}
      >
        Filtrer
      </Button>
    </div>
  );
}
