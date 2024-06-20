import { Button, ButtonGroup, DateValue, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RangeCalendar } from "@nextui-org/react";
import { useState } from "react";
import { today, getLocalTimeZone, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

export default function FilterModal({ isOpen, onOpenChange, minDate, maxDate, handleFilter }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, minDate: DateValue, maxDate: DateValue, handleFilter: (minDate: Date, maxDate: Date) => void }) {
    let [value, setValue] = useState({
        start: startOfMonth(today(getLocalTimeZone())),
        end: today(getLocalTimeZone()),
    });

    let { locale } = useLocale();

    let now = today(getLocalTimeZone());

    let thisYear = {
        start: startOfMonth(now.subtract({ months: now.month-1 })),
        end: now,
    };

    let lastMonth = {
        start: startOfMonth(now.subtract({ months: 1 })),
        end: endOfMonth(now.subtract({ months: 1 })),
    };

    let [focusedValue, setFocusedValue] = useState(today(getLocalTimeZone()));

    let thisMonth = { start: startOfMonth(now), end: now };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Filtrer</ModalHeader>
                        <ModalBody>
                            <RangeCalendar
                                aria-label="Dato filter"
                                value={value}
                                onChange={setValue}
                                minValue={minDate}
                                maxValue={maxDate}
                                focusedValue={focusedValue}
                                onFocusChange={setFocusedValue}
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
                                    >
                                        <Button
                                            onPress={() => {
                                                setValue(thisYear);
                                                setFocusedValue(thisYear.end);
                                            }}
                                        >
                                            I år
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                setValue(lastMonth);
                                                setFocusedValue(lastMonth.end);
                                            }}
                                        >
                                            Forrige måned
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                setValue(thisMonth);
                                                setFocusedValue(thisMonth.start);
                                            }}
                                        >
                                            Denne måneden
                                        </Button>
                                    </ButtonGroup>
                                }
                            />
                            <Button
                                onPress={() => {
                                    handleFilter(new Date(1970, 0, 1), new Date(1970, 0, 1))
                                    onClose();
                                }
                                }
                            >Reset filter</Button>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Lukk
                            </Button>
                            <Button color="primary" onPress={() => {
                                onClose();
                                handleFilter(value.start.toDate("Europe/Oslo"), value.end.toDate("Europe/Oslo"));
                            }}>
                                Filtrer
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}