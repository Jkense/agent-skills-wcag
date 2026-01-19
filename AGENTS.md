# WCAG Agent Skills Reference

This document contains aggregated information about all WCAG accessibility skills available in this repository. It is optimized for AI agent consumption and provides quick access to skill metadata and usage guidelines.

## Available Skills

### wcag-audit-operable-keyboard

**Description:** Route user interaction and control accessibility design patterns

**Skill Directory:** `skills/wcag-audit-operable-keyboard/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-operable-keyboard-focus

**Description:** Validate logical keyboard navigation order for interface elements

**Skill Directory:** `skills/wcag-audit-operable-keyboard-focus/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-operable-motion

**Description:** Route animation and movement accessibility design considerations

**Skill Directory:** `skills/wcag-audit-operable-motion/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-operable-motion-deep

**Description:** Animation and movement accessibility rules for dynamic interface elements

**Skill Directory:** `skills/wcag-audit-operable-motion-deep/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-operable-motion-test

**Description:** Test animations for motion sensitivity compliance and reduced motion preferences

**Skill Directory:** `skills/wcag-audit-operable-motion-test/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-operable-target-size

**Description:** Validate touch target sizes meet 44x44px minimum requirement

**Skill Directory:** `skills/wcag-audit-operable-target-size/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-color

**Description:** Route color usage and visual distinction accessibility requirements

**Skill Directory:** `skills/wcag-audit-perceivable-color/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-color-blindness

**Description:** Simulate how colors appear to users with different types of color blindness

**Skill Directory:** `skills/wcag-audit-perceivable-color-blindness/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-color-contrast

**Description:** Calculate WCAG contrast ratios for text and non-text elements

**Skill Directory:** `skills/wcag-audit-perceivable-color-contrast/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-layout

**Description:** Route page structure and spatial organization accessibility requirements

**Skill Directory:** `skills/wcag-audit-perceivable-layout/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-layout-deep

**Description:** Page structure and spatial organization accessibility design patterns

**Skill Directory:** `skills/wcag-audit-perceivable-layout-deep/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-media

**Description:** Route audio, video, and multimedia accessibility requirements

**Skill Directory:** `skills/wcag-audit-perceivable-media/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-media-deep

**Description:** Audio and video accessibility rules for multimedia content design

**Skill Directory:** `skills/wcag-audit-perceivable-media-deep/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-text

**Description:** Route typography accessibility design decisions and requirements

**Skill Directory:** `skills/wcag-audit-perceivable-text/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-text-deep

**Description:** Comprehensive typography accessibility rules for text design and readability

**Skill Directory:** `skills/wcag-audit-perceivable-text-deep/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-perceivable-text-size

**Description:** Convert between px, pt, em, rem units with accessibility context

**Skill Directory:** `skills/wcag-audit-perceivable-text-size/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-understandable-forms

**Description:** Route form input and data collection accessibility requirements

**Skill Directory:** `skills/wcag-audit-understandable-forms/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

### wcag-audit-understandable-forms-deep

**Description:** Form design accessibility rules for user input and data collection

**Skill Directory:** `skills/wcag-audit-understandable-forms-deep/`

**Installation:** Use `npx add-skill` to install this skill individually.

---

## Installation

Install all WCAG skills:
```bash
npx add-skill <repository-url>
```

Install specific skills:
```bash
npx add-skill <repository-url> --skill wcag-audit-operable-keyboard --skill wcag-audit-operable-keyboard-focus --skill wcag-audit-operable-motion
```

## Skill Categories

### Router Skills
- **wcag-audit-operable-keyboard**: Route user interaction and control accessibility design patterns
- **wcag-audit-operable-keyboard-focus**: Validate logical keyboard navigation order for interface elements
- **wcag-audit-operable-motion**: Route animation and movement accessibility design considerations
- **wcag-audit-operable-motion-deep**: Animation and movement accessibility rules for dynamic interface elements
- **wcag-audit-operable-motion-test**: Test animations for motion sensitivity compliance and reduced motion preferences
- **wcag-audit-operable-target-size**: Validate touch target sizes meet 44x44px minimum requirement
- **wcag-audit-perceivable-color**: Route color usage and visual distinction accessibility requirements
- **wcag-audit-perceivable-color-blindness**: Simulate how colors appear to users with different types of color blindness
- **wcag-audit-perceivable-color-contrast**: Calculate WCAG contrast ratios for text and non-text elements
- **wcag-audit-perceivable-layout**: Route page structure and spatial organization accessibility requirements
- **wcag-audit-perceivable-layout-deep**: Page structure and spatial organization accessibility design patterns
- **wcag-audit-perceivable-media**: Route audio, video, and multimedia accessibility requirements
- **wcag-audit-perceivable-media-deep**: Audio and video accessibility rules for multimedia content design
- **wcag-audit-perceivable-text**: Route typography accessibility design decisions and requirements
- **wcag-audit-perceivable-text-deep**: Comprehensive typography accessibility rules for text design and readability
- **wcag-audit-perceivable-text-size**: Convert between px, pt, em, rem units with accessibility context
- **wcag-audit-understandable-forms**: Route form input and data collection accessibility requirements
- **wcag-audit-understandable-forms-deep**: Form design accessibility rules for user input and data collection

### Deep Domain Skills
- **wcag-audit-operable-motion-deep**: Animation and movement accessibility rules for dynamic interface elements
- **wcag-audit-perceivable-layout-deep**: Page structure and spatial organization accessibility design patterns
- **wcag-audit-perceivable-media-deep**: Audio and video accessibility rules for multimedia content design
- **wcag-audit-perceivable-text-deep**: Comprehensive typography accessibility rules for text design and readability
- **wcag-audit-understandable-forms-deep**: Form design accessibility rules for user input and data collection

### Accessibility Tools
- **wcag-audit-operable-keyboard-focus**: Validate logical keyboard navigation order for interface elements
- **wcag-audit-operable-motion-test**: Test animations for motion sensitivity compliance and reduced motion preferences
- **wcag-audit-operable-target-size**: Validate touch target sizes meet 44x44px minimum requirement
- **wcag-audit-perceivable-color-blindness**: Simulate how colors appear to users with different types of color blindness
- **wcag-audit-perceivable-color-contrast**: Calculate WCAG contrast ratios for text and non-text elements
- **wcag-audit-perceivable-text-size**: Convert between px, pt, em, rem units with accessibility context

---

*Generated automatically from SKILL.md files. Last updated: 2026-01-19*
