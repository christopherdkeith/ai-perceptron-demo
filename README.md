# Perceptron Demo - Linear Classification

An interactive visualisation of how a perceptron (the simplest neural network) learns to classify points using a linear decision boundary.

🔗 **[Live Demo](https://christopherdkeith.github.io/ai-perceptron-demo/)** 🔗

## Overview

This educational demo shows the fundamental principles of machine learning by visualising how a single-neuron perceptron learns to separate points into two classes. Watch in real-time as the algorithm adjusts its weights and bias to find the perfect line that classifies all points correctly.

**Key Insight:** The perceptron IS a line, defined by just three numbers (Weight_x, Weight_y, and Bias). Learning means adjusting these three numbers to position and angle the line correctly.

## Features

- **Real-time Visualisation**: Watch the decision boundary (orange dashed line) adjust as the perceptron learns
- **Interactive Controls**: 
  - Adjust learning rate to see how it affects convergence speed
  - Change the target line slope and intercept
  - Generate new random data points
  - Reset and retrain from scratch
- **Live Metrics**: Track training rounds, accuracy, correct/incorrect classifications, and weight values
- **Educational Explanations**: Built-in explanations of how perceptrons work and the learning process

## Demo

The interface displays:
- **Blue points**: Labeled as -1 (below the target line)
- **Green points**: Labeled as +1 (above the target line)
- **Red line**: The target line that defines the correct classification
- **Orange dashed line**: The perceptron's current decision boundary (starts random, converges to target)

## How It Works

The perceptron learns through these steps:

1. **Make Predictions**: For each point, calculate `(Weight_x × x) + (Weight_y × y) + Bias`
   - If result ≥ 0, predict +1 (above line)
   - If result < 0, predict -1 (below line)

2. **Find Mistakes**: Compare predictions with correct labels

3. **Adjust Weights**: When wrong, update using the perceptron learning rule:
   ```
   New Weight = Old Weight + (Learning Rate × Error × Input)
   ```

4. **Repeat**: Continue until all points are classified correctly

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- NoView Online

**Just visit:** [https://christopherdkeith.github.io/ai-perceptron-demo/](https://christopherdkeith.github.io/ai-perceptron-demo/)

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/christopherdkeith/ai-perceptron-demo.git
   cd ai-perceptron-demo
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your browser
   - Right-click and select "Open with" your browser, or
   - Use a local server: `python -m http.server 8000`

### Usage

1. **Click "Start Training"** to begin the learning process
2. **Watch the accuracy increase** as the orange decision boundary moves toward the red target line
3. **Experiment with parameters**:
   - Try different learning rates (0.01 for slow/steady, 0.5 for fast/jumpy)
   - Change the target line slope and intercept
   - Generate new data points to see adaptation
4. **Reset and repeat** to see different learning trajectories

## Project Structure
index.html               # Main HTML interface (GitHub Pages entry point)
├── perceptron-demo.html     # Same as index.html (alternative access)
```
ai-perceptron-demo/
├── perceptron-demo.html    # Main HTML interface
├── perceptron.js            # Core perceptron algorithm
├── ui.js                    # UI interactions and chart rendering
├── styles.css               # Styling
└── README.md                # This file
```

## Educational Value

This demo illustrates:
- **Core AI Learning Principle**: Start with random values, measure mistakes, adjust parameters to reduce errors
- **Gradient Descent**: How small adjustments based on errors lead to optimal solutions
- **Linear Classifiers**: Understanding decision boundaries and classification
- **Hyperparameter Tuning**: How learning rate affects convergence
- **Supervised Learning**: Training with labeled data (points marked as +1 or -1)

## Key Concepts

### Perceptron
The simplest form of a neural network, consisting of:
- **Weights** (Weight_x, Weight_y): Control the angle/slope of the decision boundary
- **Bias**: Shifts the decision boundary's position
- **Activation Function**: Step function that outputs +1 or -1

### Learning Algorithm
The perceptron uses supervised learning to adjust its parameters:
- Each training round processes all data points
- Weights update only when predictions are incorrect
- Learning continues until perfect classification or manual stop

## Technical Details

- **Built with**: Vanilla JavaScript (ES5 for broad compatibility)
- **Visualisation**: Highcharts library for interactive scatter plots
- **No Dependencies**: No build tools, bundlers, or frameworks required
- **Pure Client-Side**: Runs entirely in the browser

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Contributions are welcome! Ideas for enhancements:
- Add more activation functions (sigmoid, ReLU)
- Implement multi-class classification
- Add noise to data points
- Show weight history graph
- Export training data and results

## License

This project is open source and available under the MIT License.

## Author

Christopher Keith

## Acknowledgments

This demo was created as an educational tool to help people understand the foundational concepts of neural networks and machine learning through interactive visualisation.

---

**Learning Note**: While modern neural networks are far more complex, they build on these same principles: adjusting parameters (weights) based on errors to minimise mistakes. The perceptron demonstrates this fundamental learning process in its simplest form.
