import {
  Button,
  ButtonGroup,
  DateValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RangeCalendar,
} from "@nextui-org/react";
import { useState } from "react";
import {
  today,
  getLocalTimeZone,
  startOfMonth,
  endOfMonth,
} from "@internationalized/date";
import { useTranslation } from "react-i18next";

export default function FilterModal({
  isOpen,
  onOpenChange,
  minDate,
  maxDate,
  handleFilter,
  setFiltered
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  minDate: DateValue;
  maxDate: DateValue;
  handleFilter: (minDate: Date, maxDate: Date) => void;
  setFiltered: (isFiltered: boolean) => void
}) {
  const [value, setValue] = useState({
    start: startOfMonth(today(getLocalTimeZone())),
    end: today(getLocalTimeZone()),
  });
  const now = today(getLocalTimeZone());
  const thisYear = {
    start: startOfMonth(now.subtract({ months: now.month - 1 })),
    end: now,
  };
  const lastMonth = {
    start: startOfMonth(now.subtract({ months: 1 })),
    end: endOfMonth(now.subtract({ months: 1 })),
  };
  const [focusedValue, setFocusedValue] = useState(today(getLocalTimeZone()));
  const thisMonth = { start: startOfMonth(now), end: now };
  const { t } = useTranslation();

  return (
    <Modal size={window.screen.width > window.screen.height ? "4xl" : "md"} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Filtrer</ModalHeader>
            <ModalBody>
              <RangeCalendar
                visibleMonths={window.screen.width > window.screen.height ? 3 : 1}
                pageBehavior="single"
                aria-label="Dato filter"
                focusedValue={focusedValue}
                maxValue={maxDate}
                minValue={minDate}
                nextButtonProps={{
                  variant: "bordered",
                }}
                prevButtonProps={{
                  variant: "bordered",
                }}
                topContent={
                  <ButtonGroup
                    fullWidth
                    className="px-3 max-w-full pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                    radius="full"
                    size="sm"
                    variant="bordered"
                    aria-label="Dato filter"
                  >
                    <Button
                      aria-label="This year"
                      onPress={() => {
                        setValue(thisYear);
                        setFocusedValue(thisYear.end);
                      }}
                    >
                      {t('thisYear')}
                    </Button>
                    <Button
                      aria-label="Last month"
                      onPress={() => {
                        setValue(lastMonth);
                        setFocusedValue(lastMonth.end);
                      }}
                    >
                      {t('lastMonth')}
                    </Button>
                    <Button
                      aria-label="This month"
                      onPress={() => {
                        setValue(thisMonth);
                        setFocusedValue(thisMonth.start);
                      }}
                    >
                      {t('thisMonth')}
                    </Button>
                  </ButtonGroup>
                }
                value={value}
                onChange={setValue}
                onFocusChange={setFocusedValue}
              />
              <Button
                aria-label="Reset filter"
                onPress={() => {
                  handleFilter(new Date(1970, 0, 1), new Date(1970, 0, 1));
                  setFiltered(false);
                  onClose();
                }}
              >
                {t('resetFilter')}
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} aria-label="Close">
                {t('close')}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  handleFilter(
                    value.start.toDate("Europe/Oslo"),
                    value.end.toDate("Europe/Oslo"),
                  );
                  setFiltered(true);
                }}
              >
                {t('filter')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
