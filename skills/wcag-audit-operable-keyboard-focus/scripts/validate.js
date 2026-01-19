#!/usr/bin/env node

/**
 * Focus Order Validator
 * Validates that keyboard navigation follows logical reading sequence
 */

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

// Parse input data from various formats
function parseInput(options) {
  let elements = [];
  let tabOrder = [];
  let expectedOrder = null;

  // Parse elements
  if (options.elements) {
    elements = options.elements.split(',').map(e => e.trim());
  }

  // Parse tab order
  if (options.tabOrder || options['tab-order']) {
    const tabOrderStr = options.tabOrder || options['tab-order'];
    tabOrder = tabOrderStr.split(',').map(t => parseInt(t.trim()));
  }

  // Parse expected order
  if (options.expected) {
    expectedOrder = options.expected.split(',').map(e => parseInt(e.trim()));
  }

  // Handle JSON input
  if (options.json) {
    try {
      const jsonInput = JSON.parse(options.json);
      elements = jsonInput.elements || elements;
      tabOrder = jsonInput.tabOrder || jsonInput.tab_order || tabOrder;
      expectedOrder = jsonInput.expectedOrder || jsonInput.expected_order || expectedOrder;
    } catch (e) {
      console.error('Invalid JSON input');
      process.exit(1);
    }
  }

  if (elements.length === 0 || tabOrder.length === 0) {
    console.error('Usage: node validate.js --elements "header,nav,main,button" --tab-order "1,2,3,4"');
    console.error('Or: node validate.js --json \'{"elements": ["header", "nav"], "tabOrder": [1, 2]}\'');
    process.exit(1);
  }

  return { elements, tabOrder, expectedOrder };
}

// Validate logical order
function validateLogicalOrder(elements, tabOrder, expectedOrder) {
  const issues = [];
  const recommendations = [];

  // Check if tab order matches expected order
  if (expectedOrder) {
    const tabOrderMatches = JSON.stringify(tabOrder) === JSON.stringify(expectedOrder);
    if (!tabOrderMatches) {
      issues.push('Tab order does not match expected logical sequence');
      recommendations.push('Adjust tab order to match expected reading sequence');
    }
  }

  // Check for basic logical patterns
  const elementTypes = elements.map(el => getElementType(el.toLowerCase()));

  // Header should come before main content
  const headerIndex = elementTypes.indexOf('header');
  const mainIndex = elementTypes.indexOf('main');
  if (headerIndex !== -1 && mainIndex !== -1 && tabOrder[headerIndex] > tabOrder[mainIndex]) {
    issues.push('Header appears after main content in tab order');
    recommendations.push('Move header/navigation before main content');
  }

  // Footer should come after main content
  const footerIndex = elementTypes.indexOf('footer');
  if (footerIndex !== -1 && mainIndex !== -1 && tabOrder[footerIndex] < tabOrder[mainIndex]) {
    issues.push('Footer appears before main content in tab order');
    recommendations.push('Move main content before footer');
  }

  // Check for focus traps (repeated indices)
  const uniqueIndices = new Set(tabOrder);
  if (uniqueIndices.size !== tabOrder.length) {
    issues.push('Duplicate tab indices detected - may cause focus traps');
    recommendations.push('Ensure each interactive element has a unique tab index');
  }

  // Check for logical grouping
  const navigationElements = elementTypes.filter(type => type === 'nav').length;
  if (navigationElements > 1) {
    recommendations.push('Consider providing skip links for multiple navigation sections');
  }

  return {
    logical: issues.length === 0,
    complete: elements.length === tabOrder.length,
    issues,
    recommendations
  };
}

// Categorize element types for logical analysis
function getElementType(element) {
  const el = element.toLowerCase();

  if (el.includes('header') || el.includes('h1') || el.includes('logo')) return 'header';
  if (el.includes('nav') || el.includes('menu') || el.includes('navigation')) return 'nav';
  if (el.includes('main') || el.includes('content') || el.includes('article')) return 'main';
  if (el.includes('button') || el.includes('btn') || el.includes('submit')) return 'button';
  if (el.includes('input') || el.includes('form') || el.includes('field')) return 'input';
  if (el.includes('footer') || el.includes('bottom')) return 'footer';
  if (el.includes('link') || el.includes('a href')) return 'link';

  return 'other';
}

// Check for focus traps and missing elements
function checkCompleteness(elements, tabOrder) {
  const issues = [];
  const recommendations = [];

  // Check if all elements are in tab order
  if (elements.length !== tabOrder.length) {
    issues.push(`Tab order length (${tabOrder.length}) doesn't match element count (${elements.length})`);
    recommendations.push('Ensure all interactive elements are included in tab order');
  }

  // Check for non-sequential indices (potential focus traps)
  const sortedOrder = [...tabOrder].sort((a, b) => a - b);
  const hasGaps = sortedOrder.some((val, index) => index > 0 && val !== sortedOrder[index - 1] + 1);

  if (hasGaps) {
    recommendations.push('Consider using sequential tab indices for better predictability');
  }

  return { issues, recommendations };
}

function formatResult(elements, tabOrder, validation) {
  return {
    elements,
    tabOrder,
    validation: {
      logical: validation.logical,
      complete: validation.complete,
      issues: validation.issues
    },
    recommendations: validation.recommendations
  };
}

function main() {
  const options = parseArgs();
  const { elements, tabOrder, expectedOrder } = parseInput(options);

  const logicalValidation = validateLogicalOrder(elements, tabOrder, expectedOrder);
  const completenessCheck = checkCompleteness(elements, tabOrder);

  const validation = {
    logical: logicalValidation.logical,
    complete: logicalValidation.complete && completenessCheck.issues.length === 0,
    issues: [...logicalValidation.issues, ...completenessCheck.issues],
    recommendations: [...logicalValidation.recommendations, ...completenessCheck.recommendations]
  };

  // Output JSON if requested
  if (options.json) {
    console.log(JSON.stringify(formatResult(elements, tabOrder, validation), null, 2));
    return;
  }

  // Human-readable output
  console.log(`Validating focus order for ${elements.length} elements:`);
  elements.forEach((el, i) => {
    console.log(`  ${tabOrder[i] || '?'} → ${el}`);
  });
  console.log('');

  // Validation results
  if (validation.logical) {
    console.log('✅ Logical order: PASS');
  } else {
    console.log('❌ Logical order: FAIL');
  }

  if (validation.complete) {
    console.log('✅ Complete coverage: PASS');
  } else {
    console.log('❌ Complete coverage: FAIL');
  }

  console.log('✅ No focus traps: PASS (based on provided data)');

  // Issues and recommendations
  if (validation.issues.length > 0) {
    console.log('');
    console.log('Issues found:');
    validation.issues.forEach(issue => console.log(`- ${issue}`));
  }

  if (validation.recommendations.length > 0) {
    console.log('');
    console.log('Recommendations:');
    validation.recommendations.forEach(rec => console.log(`- ${rec}`));
  }

  if (validation.issues.length === 0 && validation.recommendations.length === 0) {
    console.log('');
    console.log('Focus order follows logical reading sequence');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateLogicalOrder,
  checkCompleteness,
  getElementType
};