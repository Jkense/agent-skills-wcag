#!/usr/bin/env node

/**
 * Color Blindness Simulator
 * Simulates how colors appear to users with different types of color blindness
 */

// Color blindness transformation matrices
// Based on research by Machado et al. and Vienot et al.
const TRANSFORMATION_MATRICES = {
  protanopia: [
    [0.567, 0.433, 0.000],
    [0.558, 0.442, 0.000],
    [0.000, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0.000],
    [0.700, 0.300, 0.000],
    [0.000, 0.300, 0.700]
  ],
  tritanopia: [
    [0.950, 0.050, 0.000],
    [0.000, 0.433, 0.567],
    [0.000, 0.475, 0.525]
  ]
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        options[key] = value;
        i++; // Skip next arg as it's the value
      } else {
        options[key] = true;
      }
    }
  }

  return options;
}

// Parse color from various formats (hex, rgb)
function parseColor(color) {
  if (!color) return null;

  // Remove spaces and convert to lowercase
  color = color.trim().toLowerCase();

  // Hex format (#RGB, #RRGGBB)
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      // #RGB -> #RRGGBB
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    } else if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }
  }

  // RGB format
  if (color.startsWith('rgb(') && color.endsWith(')')) {
    const values = color.slice(4, -1).split(',').map(v => parseInt(v.trim()));
    if (values.length === 3) {
      return { r: values[0], g: values[1], b: values[2] };
    }
  }

  return null;
}

// Convert RGB to LMS color space
function rgbToLms(r, g, b) {
  // Normalize to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Convert to LMS (Long, Medium, Short wavelengths)
  const L = (17.8824 * rNorm) + (43.5161 * gNorm) + (4.11935 * bNorm);
  const M = (3.45565 * rNorm) + (27.1554 * gNorm) + (3.86714 * bNorm);
  const S = (0.0299566 * rNorm) + (0.184309 * gNorm) + (1.46709 * bNorm);

  return [L, M, S];
}

// Convert LMS back to RGB
function lmsToRgb(L, M, S) {
  // Convert back to RGB
  let r = (0.0809444479 * L) + (-0.130504409 * M) + (0.116721066 * S);
  let g = (-0.0102485335 * L) + (0.0540193266 * M) + (-0.113614708 * S);
  let b = (-0.000365296938 * L) + (-0.00412161469 * M) + (0.693511405 * S);

  // Clamp to 0-1 range
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  // Convert to 0-255 range
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Simulate color blindness using transformation matrix
function simulateColorBlindness(color, type) {
  const matrix = TRANSFORMATION_MATRICES[type];
  if (!matrix) {
    throw new Error(`Unknown color blindness type: ${type}`);
  }

  // Convert RGB to LMS
  const [L, M, S] = rgbToLms(color.r, color.g, color.b);

  // Apply transformation matrix
  const newL = (matrix[0][0] * L) + (matrix[0][1] * M) + (matrix[0][2] * S);
  const newM = (matrix[1][0] * L) + (matrix[1][1] * M) + (matrix[1][2] * S);
  const newS = (matrix[2][0] * L) + (matrix[2][1] * M) + (matrix[2][2] * S);

  // Convert back to RGB
  return lmsToRgb(newL, newM, newS);
}

function colorToHex(color) {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

function colorToRgbString(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function getDescription(type) {
  const descriptions = {
    protanopia: 'Red-blind (missing red cones) - affects ~2% of males',
    deuteranopia: 'Green-blind (missing green cones) - affects ~6% of males',
    tritanopia: 'Blue-blind (missing blue cones) - affects ~0.003% of population'
  };
  return descriptions[type] || 'Unknown color blindness type';
}

function main() {
  const options = parseArgs();

  // Handle JSON input
  if (options.json) {
    try {
      const jsonInput = JSON.parse(options.json);
      options.color = jsonInput.color;
      options.type = jsonInput.type;
    } catch (e) {
      console.error('Invalid JSON input');
      process.exit(1);
    }
  }

  const color = parseColor(options.color);
  const type = options.type;

  if (!color) {
    console.error('Usage: node simulate.js --color "#FF0000" --type protanopia');
    console.error('Supported types: protanopia, deuteranopia, tritanopia');
    console.error('Or: node simulate.js --json \'{"color": "#FF0000", "type": "protanopia"}\'');
    process.exit(1);
  }

  if (!type || !TRANSFORMATION_MATRICES[type]) {
    console.error('Invalid or missing color blindness type. Supported: protanopia, deuteranopia, tritanopia');
    process.exit(1);
  }

  try {
    const simulatedColor = simulateColorBlindness(color, type);

    // Output JSON if requested
    if (options.json) {
      console.log(JSON.stringify({
        original: colorToHex(color),
        simulated: colorToHex(simulatedColor),
        type: type,
        description: getDescription(type)
      }, null, 2));
      return;
    }

    // Human-readable output
    console.log(`Original: ${colorToHex(color)} (${colorToRgbString(color)})`);
    console.log(`${type}: ${colorToHex(simulatedColor)} (${colorToRgbString(simulatedColor)})`);
    console.log(`This color appears as ${getDescription(type).split(' - ')[0].toLowerCase()} to someone with ${type}`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseColor,
  simulateColorBlindness,
  TRANSFORMATION_MATRICES
};