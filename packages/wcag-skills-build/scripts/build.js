#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

const SKILLS_DIR = path.join(__dirname, '../../../skills');
const ROOT_DIR = path.join(__dirname, '../../..');

/**
 * Extract skill metadata from SKILL.md files
 */
function getAllSkillsMetadata() {
  const skills = [];

  const skillFiles = glob.sync('**/SKILL.md', {
    cwd: SKILLS_DIR,
    absolute: true
  });

  skillFiles.forEach((skillFile) => {
    try {
      const content = fs.readFileSync(skillFile, 'utf8');
      const parsed = matter(content);

      if (parsed.data.name && parsed.data.description) {
        const skillName = path.basename(path.dirname(skillFile));
        skills.push({
          name: parsed.data.name,
          description: parsed.data.description,
          directory: skillName,
          path: skillFile
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not parse ${skillFile}: ${error.message}`);
    }
  });

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generate AGENTS.md with aggregated skill information
 */
function generateAgentsMd(skills) {
  const header = `# WCAG Agent Skills Reference

This document contains aggregated information about all WCAG accessibility skills available in this repository. It is optimized for AI agent consumption and provides quick access to skill metadata and usage guidelines.

## Available Skills

`;

  const skillEntries = skills.map(skill => {
    return `### ${skill.name}

**Description:** ${skill.description}

**Skill Directory:** \`skills/${skill.directory}/\`

**Installation:** Use \`npx add-skill\` to install this skill individually.

---
`;
  }).join('\n');

  const footer = `
## Installation

Install all WCAG skills:
\`\`\`bash
npx add-skill <repository-url>
\`\`\`

Install specific skills:
\`\`\`bash
npx add-skill <repository-url> --skill ${skills.slice(0, 3).map(s => s.name).join(' --skill ')}
\`\`\`

## Skill Categories

### Router Skills
${skills.filter(s => s.name.startsWith('wcag-')).map(s => `- **${s.name}**: ${s.description}`).join('\n')}

### Deep Domain Skills
${skills.filter(s => s.name.includes('-deep')).map(s => `- **${s.name}**: ${s.description}`).join('\n')}

### Accessibility Tools
${skills.filter(s => {
  const toolSuffixes = ['-focus', '-test', '-size', '-contrast', '-blindness', '-target-size'];
  return toolSuffixes.some(suffix => s.name.endsWith(suffix));
}).map(s => `- **${s.name}**: ${s.description}`).join('\n')}

---

*Generated automatically from SKILL.md files. Last updated: ${new Date().toISOString().split('T')[0]}*
`;

  return header + skillEntries + footer;
}

/**
 * Update README.md with installation instructions
 */
function updateReadme(skills) {
  const readmePath = path.join(ROOT_DIR, 'README.md');

  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Update the installation section
    const installSection = `## Installation

\`\`\`sh
npx add-skill <repository-url>
\`\`\`

Or install specific skills:

\`\`\`sh
npx add-skill <repository-url> --skill wcag-audit-perceivable-color --skill wcag-audit-understandable-forms
\`\`\`

## Available Skills

This repository contains ${skills.length} WCAG accessibility skills:

${skills.map(skill => `- **${skill.name}**: ${skill.description}`).join('\n')}

`;

    // Replace or add the installation section
    if (readmeContent.includes('## Installation')) {
      const installRegex = /## Installation[\s\S]*?(?=## |$)/;
      readmeContent = readmeContent.replace(installRegex, installSection);
    } else {
      // Add installation section after the description
      const lines = readmeContent.split('\n');
      const insertIndex = lines.findIndex(line => line.trim() === '') + 1;
      lines.splice(insertIndex, 0, installSection.trim());
      readmeContent = lines.join('\n');
    }

    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ Updated README.md with installation instructions');

  } catch (error) {
    console.warn(`Warning: Could not update README.md: ${error.message}`);
  }
}

/**
 * Generate skills.json configuration file
 */
function generateSkillsConfig(skills) {
  const configPath = path.join(__dirname, '../config/skills.json');

  const config = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    repository: "agent-skills-wcag",
    totalSkills: skills.length,
    skills: skills.reduce((acc, skill) => {
      let category;
      const toolSuffixes = ['-focus', '-test', '-size', '-contrast', '-blindness', '-target-size'];
      const isTool = toolSuffixes.some(suffix => skill.name.endsWith(suffix));
      
      if (isTool) {
        category = 'tools';
      } else if (skill.name.includes('-deep')) {
        category = 'deep';
      } else if (skill.name.startsWith('wcag-')) {
        category = 'router';
      } else {
        category = 'other';
      }

      acc[skill.name] = {
        description: skill.description,
        directory: skill.directory,
        category: category
      };
      return acc;
    }, {})
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Generated config/skills.json');
}

/**
 * Main build function
 */
function build() {
  console.log('🔨 Building WCAG skills package...\n');

  // Get all skills metadata
  const skills = getAllSkillsMetadata();
  console.log(`📋 Found ${skills.length} skills to process`);

  // Generate AGENTS.md
  const agentsMd = generateAgentsMd(skills);
  const agentsPath = path.join(ROOT_DIR, 'AGENTS.md');
  fs.writeFileSync(agentsPath, agentsMd);
  console.log('✅ Generated AGENTS.md');

  // Update README.md
  updateReadme(skills);

  // Generate skills config
  generateSkillsConfig(skills);

  console.log('\n🎉 Build completed successfully!');
  console.log(`   • Processed ${skills.length} skills`);
  console.log('   • Generated AGENTS.md');
  console.log('   • Updated README.md');
  console.log('   • Created config/skills.json');
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, getAllSkillsMetadata, generateAgentsMd };