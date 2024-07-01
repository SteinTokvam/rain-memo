import { DotIcon } from "./icons";


export default function CustomDot({ cx, cy, payload }: { cx: number, cy: number, payload: any }) {
    if(payload.event_text) {
        return <DotIcon x={cx - 10} y={cy - 10}/>
    }
    return
}