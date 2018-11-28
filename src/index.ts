import { TimeGraphAxis } from "./layer/time-graph-axis";
import { TimeGraphChart } from "./layer/time-graph-chart";
import { TimeGraphUnitController } from "./time-graph-unit-controller";
import { TimeGraphNavigator } from "./layer/time-graph-navigator";
import { TimeGraphContainer } from "./time-graph-container";
import { TimeGraphChartCursors } from "./layer/time-graph-chart-cursors";
import { TimeGraphAxisCursors } from "./layer/time-graph-axis-cursors";
import { timeGraph } from "./test-data";
import { TimeGraphRowElementModel } from "./time-graph-model";
import { TimeGraphRowElement, TimeGraphRowElementStyle } from "./components/time-graph-row-element";
import { TimeGraphChartGrid } from "./layer/time-graph-chart-grid";
// import { TimeGraphChartArrows } from "./layer/time-graph-chart-arrows";


const mainWidth = 1000; //the width for the main container and its added canvas elements. Fixed yet!
const container = document.getElementById('main');
if (!container) {
    throw (`No container available.`);
}
container.innerHTML = '';
container.style.width = mainWidth + "px";

const unitController = new TimeGraphUnitController(timeGraph.totalRange, { start: 12000, end: 50000 });

const axisHTMLContainer = document.createElement('div');
axisHTMLContainer.id = 'main_axis';
container.appendChild(axisHTMLContainer);

const timeGraphAxisContainer = new TimeGraphContainer({
    height: 30,
    width: mainWidth,
    id: timeGraph.id + '_axis'
}, unitController);
axisHTMLContainer.appendChild(timeGraphAxisContainer.canvas);

const timeAxisLayer = new TimeGraphAxis('timeGraphAxis');
timeGraphAxisContainer.addLayer(timeAxisLayer);

const timeAxisCursors = new TimeGraphAxisCursors('timeGraphAxisCursors');
timeGraphAxisContainer.addLayer(timeAxisCursors);

const chartHTMLContainer = document.createElement('div');
chartHTMLContainer.id = 'main_chart';
container.appendChild(chartHTMLContainer);

const timeGraphChartContainer = new TimeGraphContainer({
    id: timeGraph.id + '_chart',
    height: 300,
    width: mainWidth,
    backgroundColor: 0xFFFFFF
}, unitController);
chartHTMLContainer.appendChild(timeGraphChartContainer.canvas);

const rowHeight = 24;

const timeGraphChartGridLayer = new TimeGraphChartGrid('timeGraphGrid', rowHeight);
timeGraphChartContainer.addLayer(timeGraphChartGridLayer);

function getRowElementStyle(model: TimeGraphRowElementModel): TimeGraphRowElementStyle {
    if (model.data && model.data.type) {
        if (model.data.type === 'red') {
            return {
                color: 0xbc2f00,
                height: 10,
                borderWidth: 0
            }
        } else if (model.data.type === 'yellow') {
            return {
                color: 0xccbf5d,
                height: 10,
                borderWidth: 0
            }
        }
    }
    return {
        color: 0x11ad1b,
        height: 18,
        borderWidth: 0
    }
}

const timeGraphChartLayer = new TimeGraphChart('timeGraphChart');
timeGraphChartContainer.addLayer(timeGraphChartLayer);

timeGraphChartLayer.registerRowElementStyleHook((model: TimeGraphRowElementModel) => {
    return getRowElementStyle(model);
});
timeGraphChartLayer.registerRowElementMouseInteractions({
    click: el => { console.log(el.model.label) }
});
let selectedElement: TimeGraphRowElement;
timeGraphChartLayer.onSelectedRowElementChanged(el => {
    if (selectedElement) {
        selectedElement.style = getRowElementStyle(selectedElement.model);
    }
    selectedElement = el;
    el.style = {
        borderWidth: 1
    }
});
timeGraphChartLayer.addRows(timeGraph.rows, rowHeight);

// const timeGraphChartArrows = new TimeGraphChartArrows('chartArrows');
// timeGraphChartContainer.addLayer(timeGraphChartArrows);
// timeGraphChartArrows.addArrows(timeGraph.arrows, rowHeight);

const timeGraphChartCursors = new TimeGraphChartCursors('chart-cursors');
timeGraphChartContainer.addLayer(timeGraphChartCursors);
timeGraphChartCursors.onNavigateLeft(() => {
    const selectedRowIndex = selectedElement.row.rowIndex;
    const row = timeGraph.rows[selectedRowIndex];
    const states = row.states;
    const nextIndex = states.findIndex((rowElementModel: TimeGraphRowElementModel) => {
        return rowElementModel.range.start >= unitController.selectionRange.start;
    });
    if (nextIndex > 0) {
        const newPos = states[nextIndex - 1].range.start;
        unitController.selectionRange = { start: newPos, end: newPos };
    }
});
timeGraphChartCursors.onNavigateRight(() => {
    const selectedRowIndex = selectedElement.row.rowIndex;
    const row = timeGraph.rows[selectedRowIndex];
    const states = row.states;
    const nextIndex = states.findIndex((rowElementModel: TimeGraphRowElementModel) => {
        return rowElementModel.range.start > unitController.selectionRange.start;
    });
    if (nextIndex < states.length) {
        const newPos = states[nextIndex].range.start;
        unitController.selectionRange = { start: newPos, end: newPos };
    }
});

const naviEl = document.createElement('div');
naviEl.id = "navi";
container.appendChild(naviEl);
const naviContainer = new TimeGraphContainer({
    width: mainWidth,
    height: 10,
    id: 'navi',
    backgroundColor: 0xeeeed9
}, unitController);
const navi = new TimeGraphNavigator('timeGraphNavigator');
naviContainer.addLayer(navi);
naviEl.appendChild(naviContainer.canvas);