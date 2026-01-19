#!/usr/bin/env node

/**
 * Touch Target Size Checker
 * Validates interactive elements meet WCAG 44x44px minimum size requirements
 */

const WCAG_MINIMUM_SIZE = 44; // pixels
const RECOMMENDED_SPACING = 8; // pixels

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

// Parse dimensions from various formats
function parseDimensions(options) {
  let width = null;
  let height = null;

  // Parse explicit width/height
  if (options.width) {
    width = parseInt(options.width);
  }
  if (options.height) {
    height = parseInt(options.height);
  }

  // Parse dimensions format (e.g., "44x44")
  if (options.dimensions && options.dimensions.includes('x')) {
    const parts = options.dimensions.split('x');
    width = parseInt(parts[0]);
    height = parseInt(parts[1]);
  }

  // Handle JSON input
  if (options.json) {
    try {
      const jsonInput = JSON.parse(options.json);
      width = jsonInput.width || width;
      height = jsonInput.height || height;
      options.spacing = jsonInput.spacing || options.spacing;
      options.element = jsonInput.element || options.element;
    } catch (e) {
      console.error('Invalid JSON input');
      process.exit(1);
    }
  }

  if (!width || !height || isNaN(width) || isNaN(height)) {
    console.error('Usage: node check.js --width 48 --height 48 [--spacing 8] [--element "button"]');
    console.error('Or: node check.js --dimensions "48x48"');
    console.error('Or: node check.js --json \'{"width": 48, "height": 48, "spacing": 8}\'');
    process.exit(1);
  }

  return {
    width: width,
    height: height,
    spacing: options.spacing ? parseInt(options.spacing) : null,
    element: options.element || 'interactive element'
  };
}

// Check size compliance
function checkSize(width, height) {
  const meetsMinimum = width >= WCAG_MINIMUM_SIZE && height >= WCAG_MINIMUM_SIZE;
  return {
    compliant: meetsMinimum,
    minimumWidth: WCAG_MINIMUM_SIZE,
    minimumHeight: WCAG_MINIMUM_SIZE,
    actualWidth: width,
    actualHeight: height
  };
}

// Check spacing compliance
function checkSpacing(spacing) {
  if (spacing === null) {
    return {
      compliant: null, // Unknown
      recommended: RECOMMENDED_SPACING,
      actual: null
    };
  }

  const meetsRecommended = spacing >= RECOMMENDED_SPACING;
  return {
    compliant: meetsRecommended,
    recommended: RECOMMENDED_SPACING,
    actual: spacing
  };
}

// Generate recommendations
function generateRecommendations(sizeCheck, spacingCheck) {
  const recommendations = [];

  if (!sizeCheck.compliant) {
    if (sizeCheck.actualWidth < WCAG_MINIMUM_SIZE) {
      recommendations.push(`Increase width to at least ${WCAG_MINIMUM_SIZE}px (currently ${sizeCheck.actualWidth}px)`);
    }
    if (sizeCheck.actualHeight < WCAG_MINIMUM_SIZE) {
      recommendations.push(`Increase height to at least ${WCAG_MINIMUM_SIZE}px (currently ${sizeCheck.actualHeight}px)`);
    }
  }

  if (spacingCheck.compliant === false) {
    recommendations.push(`Ensure at least ${RECOMMENDED_SPACING}px spacing between adjacent interactive elements (currently ${spacingCheck.actual}px)`);
  } else if (spacingCheck.compliant === null) {
    recommendations.push(`Consider providing at least ${RECOMMENDED_SPACING}px spacing between adjacent interactive elements`);
  }

  return recommendations;
}

function formatResult(sizeCheck, spacingCheck, recommendations, element) {
  const result = {
    element: element,
    dimensions: {
      width: sizeCheck.actualWidth,
      height: sizeCheck.actualHeight
    },
    minimumRequired: {
      width: WCAG_MINIMUM_SIZE,
      height: WCAG_MINIMUM_SIZE
    },
    compliance: {
      size: sizeCheck.compliant,
      spacing: spacingCheck.compliant
    }
  };

  if (recommendations.length > 0) {
    result.recommendations = recommendations;
  }

  return result;
}

function main() {
  const options = parseArgs();
  const { width, height, spacing, element } = parseDimensions(options);

  const sizeCheck = checkSize(width, height);
  const spacingCheck = checkSpacing(spacing);
  const recommendations = generateRecommendations(sizeCheck, spacingCheck);

  // Output JSON if requested
  if (options.json) {
    console.log(JSON.stringify(formatResult(sizeCheck, spacingCheck, recommendations, element), null, 2));
    return;
  }

  // Human-readable output
  console.log(`Checking target size for: ${element}`);
  console.log(`Dimensions: ${width}x${height}px`);
  console.log(`Minimum required: ${WCAG_MINIMUM_SIZE}x${WCAG_MINIMUM_SIZE}px`);
  console.log('');

  // Size check
  if (sizeCheck.compliant) {
    console.log(`✅ Size: PASS (${width}x${height}px meets ${WCAG_MINIMUM_SIZE}x${WCAG_MINIMUM_SIZE}px minimum)`);
  } else {
    console.log(`❌ Size: FAIL (${width}x${height}px is below ${WCAG_MINIMUM_SIZE}x${WCAG_MINIMUM_SIZE}px minimum)`);
  }

  // Spacing check
  if (spacingCheck.compliant === true) {
    console.log(`✅ Spacing: PASS (${spacing}px spacing provided)`);
  } else if (spacingCheck.compliant === false) {
    console.log(`❌ Spacing: FAIL (insufficient spacing between targets)`);
  } else {
    console.log(`⚠️  Spacing: UNKNOWN (not specified - recommend at least ${RECOMMENDED_SPACING}px)`);
  }

  // Recommendations
  if (recommendations.length > 0) {
    console.log('');
    console.log('Recommendations:');
    recommendations.forEach(rec => console.log(`- ${rec}`));
  } else {
    console.log('');
    console.log('No issues found - this target meets accessibility requirements');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkSize,
  checkSpacing,
  generateRecommendations,
  WCAG_MINIMUM_SIZE,
  RECOMMENDED_SPACING
};