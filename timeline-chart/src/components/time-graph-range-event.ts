import { TimeGraphComponent, TimeGraphStyledRect, TimeGraphElementPosition } from "./time-graph-component";

import { TimelineChart } from "../time-graph-model";


export interface TimeGraphStateStyle {
    color?: number
    height?: number
    borderWidth?: number
    borderColor?: number
}

export class TimeGraphRangeEvent extends TimeGraphComponent {

    protected _height: number;
    protected _position: TimeGraphElementPosition;

    protected _options: TimeGraphStyledRect;

    constructor(
        id: string,
        protected range: TimelineChart.TimeGraphRange,
        protected _style: TimeGraphStateStyle = { color: 0xfffa66, height: 14 }
    ) {
        super(id);
        this._height = _style.height || 14;
        this._height = 20
        this._position = {
            x: this.range.start,
            y:0
        };
        // min width of a state should never be less than 1 (for visibility)
        const width = Math.max(1, this.range.end - this.range.start);
        this._options = {
            color: _style.color,
            height: this._height,
            position: this._position,
            width,
            borderRadius: 2,
            borderWidth: _style.borderWidth || 0,
            borderColor: _style.borderColor || 0x000000
        };
    }


    set style(style: TimeGraphStateStyle) {
        if (style.color !== undefined) {
            this._options.color = style.color;
        }
        if (style.height !== undefined) {
            this._options.height = style.height;
        }
        if (style.borderColor !== undefined) {
            this._options.borderColor = style.borderColor;
        }
        if (style.borderWidth !== undefined) {
            this._options.borderWidth = style.borderWidth;
        }
        this.update();
    }

    update(opts?: TimeGraphStyledRect) {
        if (opts) {
            this._options.position = opts.position;
            this._options.width = opts.width;
            this._options.displayWidth = opts.displayWidth;
        }
        super.update();
    }

    render() {
        this.rect(this._options);
    }

}
