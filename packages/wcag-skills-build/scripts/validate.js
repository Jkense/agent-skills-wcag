#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

const SKILLS_DIR = path.join(__dirname, '../../../skills');

/**
 * Validate a single SKILL.md file
 */
function validateSkillFile(skillPath) {
  const errors = [];
  const warnings = [];

  try {
    const content = fs.readFileSync(skillPath, 'utf8');
    const parsed = matter(content);

    // Check required frontmatter
    if (!parsed.data.name) {
      errors.push('Missing required "name" field in frontmatter');
    } else if (typeof parsed.data.name !== 'string') {
      errors.push('"name" field must be a string');
    } else if (!/^[a-z0-9-]{1,64}$/.test(parsed.data.name)) {
      errors.push('"name" field must be lowercase, contain only letters, numbers, and hyphens (1-64 chars)');
    }

    if (!parsed.data.description) {
      errors.push('Missing required "description" field in frontmatter');
    } else if (typeof parsed.data.description !== 'string') {
      errors.push('"description" field must be a string');
    } else if (parsed.data.description.length < 1 || parsed.data.description.length > 1024) {
      errors.push('"description" field must be 1-1024 characters');
    }

    // Check for proper markdown structure
    if (!parsed.content.trim()) {
      warnings.push('SKILL.md has no content body (only frontmatter)');
    }

    // Check for "When to Use" section
    if (!parsed.content.includes('## When to Use') && !parsed.content.includes('### When to Use')) {
      warnings.push('Consider adding a "When to Use" section to help agents understand when to apply this skill');
    }

  } catch (error) {
    errors.push(`Failed to parse SKILL.md: ${error.message}`);
  }

  return { errors, warnings };
}

/**
 * Validate all skills in the repository
 */
function validateAllSkills() {
  console.log('🔍 Validating WCAG skills...\n');

  let totalErrors = 0;
  let totalWarnings = 0;

  // Find all SKILL.md files
  const skillFiles = glob.sync('**/SKILL.md', {
    cwd: SKILLS_DIR,
    absolute: true
  });

  if (skillFiles.length === 0) {
    console.error('❌ No SKILL.md files found in skills directory');
    process.exit(1);
  }

  console.log(`Found ${skillFiles.length} skill(s) to validate:\n`);

  skillFiles.forEach((skillFile) => {
    const skillName = path.basename(path.dirname(skillFile));
    console.log(`📋 Validating: ${skillName}`);

    const { errors, warnings } = validateSkillFile(skillFile);

    if (errors.length > 0) {
      console.log('  ❌ Errors:');
      errors.forEach(error => console.log(`    • ${error}`));
      totalErrors += errors.length;
    }

    if (warnings.length > 0) {
      console.log('  ⚠️  Warnings:');
      warnings.forEach(warning => console.log(`    • ${warning}`));
      totalWarnings += warnings.length;
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('  ✅ Valid');
    }

    console.log('');
  });

  // Summary
  console.log('📊 Validation Summary:');
  console.log(`  • Skills checked: ${skillFiles.length}`);
  console.log(`  • Total errors: ${totalErrors}`);
  console.log(`  • Total warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.log('\n❌ Validation failed due to errors');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  Validation passed with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ All skills validated successfully');
    process.exit(0);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateAllSkills();
}

module.exports = { validateSkillFile, validateAllSkills };