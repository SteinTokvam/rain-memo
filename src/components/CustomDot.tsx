import { DotIcon } from "./icons";


export default function CustomDot({ cx, cy, stroke, payload, value }: { cx: number, cy: number, stroke: string, payload: any, value: any }) {
    if(payload.event_text) {
        return <DotIcon x={cx - 10} y={cy - 10}/>
    }
    return
}