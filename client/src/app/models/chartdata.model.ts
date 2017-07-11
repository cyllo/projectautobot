export const ChartType = {
    line: 'line',
    bar: 'bar',
    radar: 'radar',
    pie: 'pie',
    polarArea: 'polarArea',
    doughnut: 'doughnut',
};

export interface ChartDataset {
    label: string;
    data: number[];
}

export interface ChartData {
    xAxisLabels: string[];
    datasets: ChartDataset[];
    chartType: string;
    legend: boolean;
}
