// ===================================
// PERCEPTRON ALGORITHM
// ===================================
// This file contains the core perceptron learning algorithm.
// A perceptron is the simplest form of a neural network that
// learns to classify points based on a linear boundary.
//
// KEY INSIGHT: The perceptron IS a line, encoded in three numbers:
// - weightX and weightY control the angle/slope of the line
// - bias shifts the line up/down or left/right
// Learning means adjusting these three numbers to find the perfect line.

// Perceptron weights and bias (these three numbers ARE the line!)
var weightX = 0;      // Weight for x-coordinate (affects line's horizontal tilt)
var weightY = 0;      // Weight for y-coordinate (affects line's vertical tilt)
var bias = 0;         // Bias term (shifts the line's position)
var trainingRound = 0; // Counter for training iterations

// Perceptron prediction function
// Takes x and y coordinates and returns +1 (above line) or -1 (below line)
function predict(x, y) {
    // Calculate weighted sum: (weightX * x-coordinate) + (weightY * y-coordinate) + bias
    // This formula determines which side of the line the point is on
    var sum = weightX * x + weightY * y + bias;
    
    // Step activation function: 
    // If sum >= 0, the point is on the positive side (above/right) -> predict +1
    // If sum < 0, the point is on the negative side (below/left) -> predict -1
    // This is how the perceptron "draws" its decision boundary
    return sum >= 0 ? 1 : -1;
}

// Train the perceptron on one complete round through all data
// In each round, we check every point and adjust weights when we make mistakes
function trainOneRound() {
    var errors = 0;
    
    // Go through each training point one by one
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        
        // Make a prediction: is this point above (+1) or below (-1) our current line?
        var prediction = predict(point.x, point.y);
        
        // Calculate error: difference between correct answer and our prediction
        // error = 0  means we got it right (no change needed)
        // error = 2  means we predicted -1 but should be +1 (we're too low, move line up)
        // error = -2 means we predicted +1 but should be -1 (we're too high, move line down)
        var error = point.label - prediction;
        
        // If prediction was wrong (error != 0), update weights to correct the mistake
        if (error !== 0) {
            errors++;
            
            // Perceptron learning rule:
            // New weight = Old weight + (learning rate × error × input coordinate)
            //
            // Why multiply by the input coordinate?
            // - If x is large and positive, and we need to move the line up (error > 0),
            //   we increase weightX more to tilt the line appropriately
            // - If x is negative, we adjust in the opposite direction
            // - The learning rate controls how big each adjustment step is
            //
            // This gradually rotates and shifts the line toward the correct position
            weightX = weightX + learningRate * error * point.x;
            weightY = weightY + learningRate * error * point.y;
            bias = bias + learningRate * error;
        }
    }
    
    // Increment round counter
    trainingRound++;
    
    // Update the display to show new weights and accuracy
    updateDisplay();
    updateChart();
    
    // Stop if perfect accuracy achieved (no errors in this round)
    if (errors === 0) {
        stopTraining();
        alert('Perfect accuracy achieved! All points classified correctly.');
    }
}

// Reset perceptron to initial state (random or zero weights)
function resetPerceptron() {
    weightX = 0;
    weightY = 0;
    bias = 0;
    trainingRound = 0;
}
