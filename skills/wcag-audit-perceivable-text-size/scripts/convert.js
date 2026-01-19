#!/usr/bin/env node

/**
 * Font Size Converter
 * Converts between px, pt, em, rem units with accessibility context
 */

const WCAG_MINIMUM_BODY_TEXT = 14; // pixels
const WCAG_MINIMUM_HEADINGS = 18; // pixels
const DEFAULT_BASE_FONT = 16; // pixels
const PT_TO_PX_RATIO = 1.333; // 1pt ≈ 1.333px at 96 DPI

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

// Parse font size value and unit
function parseFontSize(input) {
  if (!input) return null;

  // Extract number and unit
  const match = input.match(/^(\d+(?:\.\d+)?)\s*(px|pt|em|rem)?$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = (match[2] || 'px').toLowerCase();

  return { value, unit };
}

// Convert font size to pixels (base unit)
function toPixels(value, unit, baseFontSize = DEFAULT_BASE_FONT) {
  switch (unit) {
    case 'px':
      return value;
    case 'pt':
      return value * PT_TO_PX_RATIO;
    case 'em':
    case 'rem':
      return value * baseFontSize;
    default:
      return value;
  }
}

// Convert from pixels to target unit
function fromPixels(pxValue, targetUnit, baseFontSize = DEFAULT_BASE_FONT) {
  switch (targetUnit) {
    case 'px':
      return pxValue;
    case 'pt':
      return pxValue / PT_TO_PX_RATIO;
    case 'em':
    case 'rem':
      return pxValue / baseFontSize;
    default:
      return pxValue;
  }
}

// Format value with appropriate precision
function formatValue(value, unit) {
  const rounded = unit === 'px' ? Math.round(value) : Math.round(value * 1000) / 1000;
  return `${rounded}${unit}`;
}

// Check WCAG accessibility compliance
function checkAccessibility(pxValue, context = 'body') {
  const minimum = context === 'heading' ? WCAG_MINIMUM_HEADINGS : WCAG_MINIMUM_BODY_TEXT;
  const meetsMinimum = pxValue >= minimum;

  const recommendations = [];
  if (!meetsMinimum) {
    const recommendedPx = minimum;
    recommendations.push(`Increase to at least ${recommendedPx}px (${formatValue(fromPixels(recommendedPx, 'pt'), 'pt')}) for ${context === 'heading' ? 'headings' : 'readable body text'}`);
  }

  return {
    meetsMinimum,
    minimumRequired: minimum,
    recommendations
  };
}

// Parse input from various formats
function parseInput(options) {
  let input = null;
  let targetUnit = 'px';
  let baseFontSize = DEFAULT_BASE_FONT;
  let context = 'body';

  // Parse direct value/unit
  if (options.from) {
    input = parseFontSize(options.from);
  } else if (options.value) {
    input = parseFontSize(options.value);
  }

  // Target unit
  if (options.to) {
    targetUnit = options.to.toLowerCase();
  }

  // Base font size
  if (options.baseFont || options['base-font']) {
    const baseInput = parseFontSize(options.baseFont || options['base-font']);
    if (baseInput) {
      baseFontSize = toPixels(baseInput.value, baseInput.unit);
    }
  }

  // Context for accessibility check
  if (options.context) {
    context = options.context.toLowerCase();
  }

  // Handle JSON input
  if (options.json) {
    try {
      const jsonInput = JSON.parse(options.json);
      if (jsonInput.from) input = parseFontSize(jsonInput.from);
      if (jsonInput.to) targetUnit = jsonInput.to.toLowerCase();
      if (jsonInput.baseFontSize) baseFontSize = parseFloat(jsonInput.baseFontSize);
      if (jsonInput.context) context = jsonInput.context.toLowerCase();
    } catch (e) {
      console.error('Invalid JSON input');
      process.exit(1);
    }
  }

  if (!input) {
    console.error('Usage: node convert.js --from "16px" --to rem [--base-font "16px"] [--accessibility-check]');
    console.error('Or: node convert.js --json \'{"from": "16px", "to": "rem"}\'');
    process.exit(1);
  }

  return { input, targetUnit, baseFontSize, context, accessibilityCheck: options.accessibilityCheck || options['accessibility-check'] };
}

function performConversion(input, targetUnit, baseFontSize) {
  // Convert to pixels first
  const pxValue = toPixels(input.value, input.unit, baseFontSize);

  // Convert to target unit
  const convertedValue = fromPixels(pxValue, targetUnit, baseFontSize);

  return {
    inputValue: input.value,
    inputUnit: input.unit,
    outputValue: convertedValue,
    outputUnit: targetUnit,
    pxValue: pxValue,
    baseFontSize: baseFontSize
  };
}

function formatResult(conversion, accessibility) {
  return {
    input: formatValue(conversion.inputValue, conversion.inputUnit),
    output: formatValue(conversion.outputValue, conversion.outputUnit),
    baseFontSize: `${conversion.baseFontSize}px`,
    accessibility: accessibility ? {
      meetsMinimum: accessibility.meetsMinimum,
      minimumRequired: accessibility.minimumRequired,
      recommendations: accessibility.recommendations
    } : undefined
  };
}

function main() {
  const options = parseArgs();
  const { input, targetUnit, baseFontSize, context, accessibilityCheck } = parseInput(options);

  const conversion = performConversion(input, targetUnit, baseFontSize);
  const accessibility = accessibilityCheck ? checkAccessibility(conversion.pxValue, context) : null;

  // Output JSON if requested
  if (options.json) {
    console.log(JSON.stringify(formatResult(conversion, accessibility), null, 2));
    return;
  }

  // Human-readable output
  console.log(`${formatValue(conversion.inputValue, conversion.inputUnit)} = ${formatValue(conversion.outputValue, conversion.outputUnit)} (base font: ${conversion.baseFontSize}px)`);

  if (accessibilityCheck) {
    if (accessibility.meetsMinimum) {
      console.log(`✅ Accessibility: PASS (${conversion.pxValue}px meets ${accessibility.minimumRequired}px minimum)`);
    } else {
      console.log(`❌ Accessibility: FAIL (${conversion.pxValue}px below ${accessibility.minimumRequired}px minimum for ${context} text)`);
      if (accessibility.recommendations.length > 0) {
        console.log(`Recommendation: ${accessibility.recommendations[0]}`);
      }
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseFontSize,
  toPixels,
  fromPixels,
  checkAccessibility,
  performConversion,
  WCAG_MINIMUM_BODY_TEXT,
  WCAG_MINIMUM_HEADINGS,
  DEFAULT_BASE_FONT
};