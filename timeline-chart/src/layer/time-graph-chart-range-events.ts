import { TimeGraphAnnotationComponent } from "../components/time-graph-annotation";
import { TimelineChart } from "../time-graph-model";
import { TimeGraphChartLayer } from "./time-graph-chart-layer";

export class TimeGraphChartRangeEvents extends TimeGraphChartLayer {

    protected rangeEvents: Map<TimelineChart.TimeGraphAnnotation, TimeGraphAnnotationComponent>;
    private _updateHandler: { (): void; (viewRange: TimelineChart.TimeGraphRange): void; (viewRange: TimelineChart.TimeGraphRange): void; };

    protected afterAddToContainer() {
        this._updateHandler = (): void => this.update();
        this.unitController.onViewRangeChanged(this._updateHandler);

        this.rowController.onVerticalOffsetChangedHandler(verticalOffset => {
            this.layer.position.y = -verticalOffset;
        });
    }


    protected addRangeEvent(rangeEvent: TimelineChart.TimeGraphAnnotation) {
        const width = this.getPixels(rangeEvent.range.end - rangeEvent.range.start);
        const height = this.stateController.canvasDisplayHeight;
        //let el: TimeGraphAnnotationComponent | undefined;
        //const elementStyle = this.providers.rowAnnotationStyleProvider ? this.providers.rowAnnotationStyleProvider(annotation) : undefined;

        const rangeEventComponent =  new TimeGraphAnnotationComponent(rangeEvent.id, { position: { x: rangeEvent.range.start, y: 0 }, width, height }, undefined);
        this.rangeEvents.set(rangeEvent, rangeEventComponent);
        this.addChild(rangeEventComponent);
    }

    addRangeEvents(rangeEvents: TimelineChart.TimeGraphAnnotation[]): void {
        if (!this.stateController) {
            throw ('Add this TimeGraphChartArrows to a container before adding arrows.');
        }
        if (this.rangeEvents) {
            this.removeChildren();
        }
        this.rangeEvents = new Map();
        rangeEvents.forEach(rangeEvent => {
            this.addRangeEvent(rangeEvent);
        })
    }

    update(): void {
        if (this.rangeEvents) {
            for (const rangeEvent of this.rangeEvents.keys()) {
                this.updateRangeEvent(rangeEvent);
            }
        }
    }

    protected updateRangeEvent(rangeEvent: TimelineChart.TimeGraphAnnotation) {
        const rangeEventComponent = this.rangeEvents.get(rangeEvent);
        const width = this.getPixels(rangeEvent.range.end - rangeEvent.range.start);
        const height = this.stateController.canvasDisplayHeight;
        if (rangeEventComponent) {
            rangeEventComponent.update({ position: { x: rangeEvent.range.start, y: 0}, width, height });
        }
    }

    destroy() : void {
        if (this.unitController) {
            this.unitController.removeViewRangeChangedHandler(this._updateHandler);
        }
        super.destroy();
    }
}