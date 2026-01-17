// ===================================
// USER INTERFACE CONTROL
// ===================================
// This file handles all UI interactions, chart visualization,
// and coordinating between the perceptron algorithm and display.

// Global UI variables
var chart;
var trainingData = [];
var isTraining = false;
var trainingInterval;
var learningRate = 0.1;

// Target line parameters (y = mx + b)
var targetSlope = 0.5;
var targetIntercept = 0.2;

// Initialize the Highcharts visualization
function initChart() {
    chart = Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            events: {
                click: function(e) {
                    // Only allow clicking if perceptron has been trained (decision boundary exists)
                    if (weightY === 0) {
                        alert('Please train the perceptron first before testing new points!');
                        return;
                    }
                    
                    // Get click coordinates relative to the chart axes
                    var xValue = e.xAxis[0].value;
                    var yValue = e.yAxis[0].value;
                    
                    // Calculate the CORRECT label based on target line
                    var lineY = targetSlope * xValue + targetIntercept;
                    var correctLabel = yValue > lineY ? 1 : -1;
                    
                    // Make prediction using the perceptron
                    var prediction = predict(xValue, yValue);
                    
                    // Determine which series to add the point to
                    var seriesIndex;
                    if (prediction === correctLabel) {
                        // Correct prediction - add to green or blue diamond series
                        seriesIndex = prediction === 1 ? 4 : 5;
                    } else {
                        // Wrong prediction - add to red diamond series
                        seriesIndex = 6;
                    }
                    
                    chart.series[seriesIndex].addPoint([xValue, yValue], true);
                }
            }
        },
        title: {
            text: 'Perceptron Learning Visualisation'
        },
        xAxis: {
            title: { text: 'X Coordinate' },
            min: -1,
            max: 1,
            gridLineWidth: 1
        },
        yAxis: {
            title: { text: 'Y Coordinate' },
            min: -1,
            max: 1
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    symbol: 'circle'
                }
            },
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [
            {
                name: 'Above Line (+1)',
                color: '#4CAF50',
                data: []
            },
            {
                name: 'Below Line (-1)',
                color: '#2196F3',
                data: []
            },
            {
                name: 'Target Line',
                type: 'line',
                color: '#f44336',
                lineWidth: 2,
                data: [],
                enableMouseTracking: false,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        // Only show label on the middle point
                        if (this.point.index === Math.floor(this.series.data.length / 2)) {
                            var sign = targetIntercept >= 0 ? ' + ' : ' ';
                            return 'Target: y = ' + targetSlope + 'x' + sign + targetIntercept;
                        }
                        return null;
                    },
                    style: {
                        color: '#f44336',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textOutline: '2px white'
                    },
                    y: -20
                }
            },
            {
                name: 'Decision Boundary',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        // Only show label on the middle point and if we have valid data
                        if (this.point.index === Math.floor(this.series.data.length / 2) && weightY !== 0) {
                            // Calculate the equation from perceptron weights
                            // Decision boundary: y = -(weightX * x + bias) / weightY
                            var slope = (-weightX / weightY).toFixed(2);
                            var intercept = (-bias / weightY).toFixed(2);
                            var sign = intercept >= 0 ? ' + ' : ' ';
                            return 'Perceptron: y = ' + slope + 'x' + sign + Math.abs(intercept);
                        }
                        return null;
                    },
                    style: {
                        color: '#FF9800',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textOutline: '2px white'
                    },
                    y: 30
                }            },
            {
                name: 'Test Point (Predicted +1)',
                color: '#4CAF50',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var sum = (weightX * x + weightY * y + bias);
                        var prediction = sum >= 0 ? '+1' : '-1';
                        return '<b>Test Point</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Calculation:</b><br/>' +
                               '(' + weightX.toFixed(3) + ' × ' + x.toFixed(2) + ') + ' +
                               '(' + weightY.toFixed(3) + ' × ' + y.toFixed(2) + ') + ' +
                               bias.toFixed(3) + '<br/>' +
                               '= ' + sum.toFixed(3) + '<br/>' +
                               '<b>Prediction: ' + prediction + '</b> (correct)';
                    }
                }
            },
            {
                name: 'Test Point (Predicted -1)',
                color: '#2196F3',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var sum = (weightX * x + weightY * y + bias);
                        var prediction = sum >= 0 ? '+1' : '-1';
                        return '<b>Test Point</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Calculation:</b><br/>' +
                               '(' + weightX.toFixed(3) + ' × ' + x.toFixed(2) + ') + ' +
                               '(' + weightY.toFixed(3) + ' × ' + y.toFixed(2) + ') + ' +
                               bias.toFixed(3) + '<br/>' +
                               '= ' + sum.toFixed(3) + '<br/>' +
                               '<b>Prediction: ' + prediction + '</b> (correct)';
                    }
                }
            },
            {
                name: 'Test Point (WRONG)',
                color: '#f44336',
                data: [],
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineWidth: 2,
                    lineColor: '#000000'
                },
                tooltip: {
                    pointFormatter: function() {
                        var x = this.x;
                        var y = this.y;
                        var sum = (weightX * x + weightY * y + bias);
                        var prediction = sum >= 0 ? '+1' : '-1';
                        // Calculate correct label
                        var lineY = targetSlope * x + targetIntercept;
                        var correctLabel = y > lineY ? '+1' : '-1';
                        return '<b>Test Point (WRONG)</b><br/>' +
                               'Coordinates: (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')<br/>' +
                               '<b>Calculation:</b><br/>' +
                               '(' + weightX.toFixed(3) + ' × ' + x.toFixed(2) + ') + ' +
                               '(' + weightY.toFixed(3) + ' × ' + y.toFixed(2) + ') + ' +
                               bias.toFixed(3) + '<br/>' +
                               '= ' + sum.toFixed(3) + '<br/>' +
                               '<b>Prediction: ' + prediction + '</b><br/>' +
                               '<span style="color: #f44336">Correct label: ' + correctLabel + '</span>';
                    }
                }
            }
        ]
    });
}

// Generate random training data points
function generateTrainingData() {
    var numPoints = parseInt(document.getElementById('num-points').value);
    trainingData = [];
    
    for (var i = 0; i < numPoints; i++) {
        // Random x and y between -1 and 1
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        
        // Calculate where the point should be relative to target line
        var lineY = targetSlope * x + targetIntercept;
        
        // Label: +1 if point is above the line, -1 if below
        var label = y > lineY ? 1 : -1;
        
        trainingData.push({ x: x, y: y, label: label });
    }
    
    updateChart();
}

// Start training process
function startTraining() {
    if (isTraining) return;
    
    learningRate = parseFloat(document.getElementById('learning-rate').value);
    isTraining = true;
    
    // Update button states
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    // Train one round every 500ms for visualization
    trainingInterval = setInterval(function() {
        trainOneRound();
    }, 500);
}

// Stop training process
function stopTraining() {
    isTraining = false;
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    // Update button states
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Reset perceptron and display
function reset() {
    stopTraining();
    resetPerceptron();
    updateDisplay();
    updateChart();
}

// Generate new data points
function generateNewData() {
    stopTraining();
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Update target line when user changes slope or intercept
function updateTargetLine() {
    stopTraining();
    targetSlope = parseFloat(document.getElementById('target-slope').value);
    targetIntercept = parseFloat(document.getElementById('target-intercept').value);
    
    // Update equation display
    var sign = targetIntercept >= 0 ? '+' : '';
    document.getElementById('target-equation').textContent = 
        'y = ' + targetSlope + 'x ' + sign + ' ' + targetIntercept;
    
    // Regenerate training data with new target line
    trainingRound = 0;
    generateTrainingData();
    updateDisplay();
}

// Update all display values in the UI
function updateDisplay() {
    document.getElementById('training-round').textContent = trainingRound;
    document.getElementById('weight-x').textContent = weightX.toFixed(3);
    document.getElementById('weight-y').textContent = weightY.toFixed(3);
    document.getElementById('bias').textContent = bias.toFixed(3);
    
    // Calculate accuracy
    var correct = 0;
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (predict(point.x, point.y) === point.label) {
            correct++;
        }
    }
    var accuracy = trainingData.length > 0 ? (correct / trainingData.length * 100) : 0;
    var wrong = trainingData.length - correct;
    
    document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
    document.getElementById('correct').textContent = correct;
    document.getElementById('wrong').textContent = wrong;
}

// Update chart with current data and lines
function updateChart() {
    var abovePoints = [];
    var belowPoints = [];
    
    // Separate points by their label
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        if (point.label === 1) {
            abovePoints.push([point.x, point.y]);
        } else {
            belowPoints.push([point.x, point.y]);
        }
    }
    
    // Calculate target line points
    var targetLineData = [];
    for (var x = -1; x <= 1; x += 0.1) {
        var y = targetSlope * x + targetIntercept;
        targetLineData.push([x, y]);
    }
    
    // Calculate decision boundary from perceptron weights
    var decisionBoundaryData = [];
    if (weightY !== 0) {
        // Decision boundary equation: weightX * x + weightY * y + bias = 0
        // Solve for y: y = -(weightX * x + bias) / weightY
        for (var x = -1; x <= 1; x += 0.1) {
            var y = -(weightX * x + bias) / weightY;
            decisionBoundaryData.push([x, y]);
        }
    }
    
    // Update all chart series
    chart.series[0].setData(abovePoints, false);
    chart.series[1].setData(belowPoints, false);
    chart.series[2].setData(targetLineData, false);
    chart.series[3].setData(decisionBoundaryData, false);
    chart.redraw();
}

// Initialize on page load
window.onload = function() {
    // Read initial target line values from inputs
    targetSlope = parseFloat(document.getElementById('target-slope').value);
    targetIntercept = parseFloat(document.getElementById('target-intercept').value);
    
    initChart();
    generateTrainingData();
    updateDisplay();
    
    // Update target line display
    var sign = targetIntercept >= 0 ? '+' : '';
    document.getElementById('target-equation').textContent = 
        'y = ' + targetSlope + 'x ' + sign + ' ' + targetIntercept;
};
