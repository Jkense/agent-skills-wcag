#!/usr/bin/env node

/**
 * Motion Tester
 * Tests animations for motion sensitivity compliance and reduced motion preferences
 */

const MAX_AUTO_DURATION = 5; // seconds
const MAX_FLASHES_PER_SECOND = 3;

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

// Parse input from various formats
function parseInput(options) {
  let duration = 0;
  let type = 'unknown';
  let flashes = 0;
  let reducedMotion = false;

  // Parse parameters
  if (options.duration) {
    duration = parseFloat(options.duration);
  }

  if (options.type) {
    type = options.type.toLowerCase();
  }

  if (options.flashes) {
    flashes = parseInt(options.flashes);
  }

  if (options.reducedMotion || options['reduced-motion']) {
    reducedMotion = options.reducedMotion === 'true' || options['reduced-motion'] === 'true';
  }

  // Handle JSON input
  if (options.json) {
    try {
      const jsonInput = JSON.parse(options.json);
      duration = jsonInput.duration || duration;
      type = jsonInput.type || type;
      flashes = jsonInput.flashes || flashes;
      reducedMotion = jsonInput.userPrefersReducedMotion || jsonInput.reducedMotion || reducedMotion;
    } catch (e) {
      console.error('Invalid JSON input');
      process.exit(1);
    }
  }

  return { duration, type, flashes, reducedMotion };
}

// Test reduced motion compliance
function testReducedMotion(duration, type, reducedMotion) {
  const issues = [];
  const recommendations = [];

  // Check if animation respects reduced motion preferences
  if (reducedMotion) {
    issues.push('User prefers reduced motion - animation should be disabled or minimized');
    recommendations.push('Disable or significantly reduce animation when user prefers reduced motion');
  }

  // Check duration for auto-playing content
  if (duration > MAX_AUTO_DURATION) {
    const autoTypes = ['carousel', 'slideshow', 'auto-advance', 'ticker', 'marquee'];
    if (autoTypes.some(t => type.includes(t))) {
      issues.push(`Auto-playing ${type} duration (${duration}s) exceeds ${MAX_AUTO_DURATION}s limit`);
      recommendations.push('Provide pause/stop controls or reduce duration to under 5 seconds');
    }
  }

  // Type-specific recommendations
  const highRiskTypes = ['parallax', 'scroll-triggered', '3d-transform'];
  if (highRiskTypes.some(t => type.includes(t))) {
    recommendations.push('Consider providing option to disable or reduce motion intensity');
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations
  };
}

// Test flashing compliance
function testFlashing(flashes) {
  const compliant = flashes <= MAX_FLASHES_PER_SECOND;
  const issues = [];
  const recommendations = [];

  if (!compliant) {
    issues.push(`Flashing frequency (${flashes} flashes/s) exceeds ${MAX_FLASHES_PER_SECOND} flashes/s limit`);
    recommendations.push('Reduce flashing to maximum 3 flashes per second');
    recommendations.push('Consider non-flashing alternatives for important information');
    recommendations.push('Test with users sensitive to flashing content');
  }

  return {
    compliant,
    issues,
    recommendations
  };
}

// Test duration compliance
function testDuration(duration, type) {
  const compliant = duration <= MAX_AUTO_DURATION;
  const issues = [];
  const recommendations = [];

  if (!compliant) {
    issues.push(`Animation duration (${duration}s) exceeds ${MAX_AUTO_DURATION}s recommended limit`);
    recommendations.push('Consider shorter duration or provide user controls');
    recommendations.push('Break long animations into smaller segments with pauses');
  }

  return {
    compliant,
    issues,
    recommendations
  };
}

// Generate overall assessment
function assessAnimation(duration, type, flashes, reducedMotion) {
  const reducedMotionTest = testReducedMotion(duration, type, reducedMotion);
  const flashingTest = testFlashing(flashes);
  const durationTest = testDuration(duration, type);

  const allIssues = [
    ...reducedMotionTest.issues,
    ...flashingTest.issues,
    ...durationTest.issues
  ];

  const allRecommendations = [
    ...reducedMotionTest.recommendations,
    ...flashingTest.recommendations,
    ...durationTest.recommendations
  ];

  // Remove duplicates
  const uniqueRecommendations = [...new Set(allRecommendations)];

  return {
    compliance: {
      reducedMotion: !reducedMotion || reducedMotionTest.compliant,
      flashing: flashingTest.compliant,
      duration: durationTest.compliant
    },
    issues: allIssues,
    recommendations: uniqueRecommendations
  };
}

function formatResult(duration, type, flashes, assessment) {
  return {
    animation: {
      duration,
      type,
      flashes
    },
    compliance: assessment.compliance,
    issues: assessment.issues,
    recommendations: assessment.recommendations
  };
}

function main() {
  const options = parseArgs();
  const { duration, type, flashes, reducedMotion } = parseInput(options);

  if (duration === 0 && !options.json) {
    console.error('Usage: node test.js --duration 3.5 --type parallax [--flashes 0] [--reduced-motion true]');
    console.error('Or: node test.js --json \'{"duration": 3.5, "type": "parallax"}\'');
    process.exit(1);
  }

  const assessment = assessAnimation(duration, type, flashes, reducedMotion);

  // Output JSON if requested
  if (options.json) {
    console.log(JSON.stringify(formatResult(duration, type, flashes, assessment), null, 2));
    return;
  }

  // Human-readable output
  console.log(`Testing ${type} animation (${duration}s duration, ${flashes} flashes/s):`);
  console.log('');

  // Compliance results
  const compliance = assessment.compliance;

  if (reducedMotion) {
    console.log('⚠️  Reduced motion: NEEDS ATTENTION (user prefers reduced motion)');
  } else {
    console.log('✅ Reduced motion: RESPECTED');
  }

  if (compliance.flashing) {
    console.log('✅ Flashing: PASS (within safe limits)');
  } else {
    console.log('❌ Flashing: FAIL (exceeds safe limits)');
  }

  if (compliance.duration) {
    console.log('✅ Duration: PASS (within recommended limits)');
  } else {
    console.log('❌ Duration: FAIL (exceeds recommended limits)');
  }

  // Issues and recommendations
  if (assessment.issues.length > 0) {
    console.log('');
    console.log('Issues found:');
    assessment.issues.forEach(issue => console.log(`- ${issue}`));
  }

  if (assessment.recommendations.length > 0) {
    console.log('');
    console.log('Recommendations:');
    assessment.recommendations.forEach(rec => console.log(`- ${rec}`));
  }

  const overallPass = Object.values(compliance).every(c => c);
  if (overallPass && assessment.issues.length === 0) {
    console.log('');
    console.log('Animation meets accessibility requirements');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  testReducedMotion,
  testFlashing,
  testDuration,
  assessAnimation,
  MAX_AUTO_DURATION,
  MAX_FLASHES_PER_SECOND
};