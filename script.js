// Global variables
var chart;
var trainingData = [];
var isTraining = false;
var trainingInterval;

// Perceptron parameters
var weightX = 0;
var weightY = 0;
var bias = 0;
var learningRate = 0.1;
var trainingRound = 0;

// Target line parameters (y = mx + b)
var targetSlope = 0.5;
var targetIntercept = 0.2;

// Initialize the chart
function initChart() {
    chart = Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Perceptron Learning Visualization'
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
                enableMouseTracking: false
            },
            {
                name: 'Decision Boundary',
                type: 'line',
                color: '#FF9800',
                lineWidth: 2,
                dashStyle: 'Dash',
                data: [],
                enableMouseTracking: false
            }
        ]
    });
}

// Generate random training data
function generateTrainingData() {
    var numPoints = parseInt(document.getElementById('num-points').value);
    trainingData = [];
    
    for (var i = 0; i < numPoints; i++) {
        var x = Math.random() * 2 - 1; // Random x between -1 and 1
        var y = Math.random() * 2 - 1; // Random y between -1 and 1
        
        // Calculate target line y-value for this x
        var lineY = targetSlope * x + targetIntercept;
        
        // Label: +1 if point is above the line, -1 if below
        var label = y > lineY ? 1 : -1;
        
        trainingData.push({ x: x, y: y, label: label });
    }
    
    updateChart();
}

// Perceptron prediction function
function predict(x, y) {
    var sum = weightX * x + weightY * y + bias;
    // Step activation function: return 1 if sum >= 0, else -1
    return sum >= 0 ? 1 : -1;
}

// Train the perceptron on one training round
function trainOneRound() {
    var errors = 0;
    
    // Go through each training point
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        var prediction = predict(point.x, point.y);
        var error = point.label - prediction;
        
        if (error !== 0) {
            errors++;
            // Update weights: w = w + learningRate * error * input
            weightX = weightX + learningRate * error * point.x;
            weightY = weightY + learningRate * error * point.y;
            bias = bias + learningRate * error;
        }
    }
    
    trainingRound++;
    updateDisplay();
    updateChart();
    
    // Stop if perfect accuracy
    if (errors === 0) {
        stopTraining();
        alert('Perfect accuracy achieved! All points classified correctly.');
    }
}

// Start training
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

// Stop training
function stopTraining() {
    isTraining = false;
    if (trainingInterval) {
        clearInterval(trainingInterval);
    }
    // Update button states
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
}

// Reset perceptron
function reset() {
    stopTraining();
    weightX = 0;
    weightY = 0;
    bias = 0;
    trainingRound = 0;
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

// Update display values
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
    
    // Calculate decision boundary
    var decisionBoundaryData = [];
    if (weightY !== 0) {
        // Decision boundary: weightX * x + weightY * y + bias = 0
        // Solve for y: y = -(weightX * x + bias) / weightY
        for (var x = -1; x <= 1; x += 0.1) {
            var y = -(weightX * x + bias) / weightY;
            decisionBoundaryData.push([x, y]);
        }
    }
    
    // Update chart series
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
