# WCAG Agent Skills

A set of [Agent Skills](https://agentskills.io/what-are-skills) for WCAG accessibility compliance. These skills extend AI agent capabilities with specialized knowledge for [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) and [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) guidelines.

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

## Installation

```sh
npx add-skill <repository-url>
```

Or install specific skills:

```sh
npx add-skill <repository-url> --skill wcag-audit-perceivable-color --skill wcag-audit-understandable-forms
```

## Available Skills

This repository contains 18 WCAG accessibility skills:

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

## Available Skills

This repository contains 18 WCAG accessibility skills organized by WCAG 2.1/2.2 principles (POUR: Perceivable, Operable, Understandable, Robust).

### Perceivable (1.x) - Information must be presentable to users

**Router Skills:**
- **wcag-audit-perceivable-color**: Route color usage and visual distinction accessibility requirements (Guideline 1.4)
- **wcag-audit-perceivable-text**: Route typography accessibility design decisions and requirements (Guideline 1.4)
- **wcag-audit-perceivable-media**: Route audio, video, and multimedia accessibility requirements (Guideline 1.2)
- **wcag-audit-perceivable-layout**: Route page structure and spatial organization accessibility requirements (Guideline 1.3)

**Deep Domain Skills:**
- **wcag-audit-perceivable-text-deep**: Comprehensive typography accessibility rules for text design and readability
- **wcag-audit-perceivable-layout-deep**: Page structure and spatial organization accessibility design patterns
- **wcag-audit-perceivable-media-deep**: Audio and video accessibility rules for multimedia content design

**Tools:**
- **wcag-audit-perceivable-color-contrast**: Calculate WCAG contrast ratios for text and non-text elements
- **wcag-audit-perceivable-color-blindness**: Simulate how colors appear to users with different types of color blindness
- **wcag-audit-perceivable-text-size**: Convert between px, pt, em, rem units with accessibility context

### Operable (2.x) - UI components must be operable

**Router Skills:**
- **wcag-audit-operable-keyboard**: Route user interaction and control accessibility design patterns (Guideline 2.1, 2.4)
- **wcag-audit-operable-motion**: Route animation and movement accessibility design considerations (Guideline 2.3, 2.5)

**Deep Domain Skills:**
- **wcag-audit-operable-motion-deep**: Animation and movement accessibility rules for dynamic interface elements

**Tools:**
- **wcag-audit-operable-keyboard-focus**: Validate logical keyboard navigation order for interface elements
- **wcag-audit-operable-target-size**: Validate touch target sizes meet 44x44px minimum requirement
- **wcag-audit-operable-motion-test**: Test animations for motion sensitivity compliance and reduced motion preferences

### Understandable (3.x) - Information and operation must be understandable

**Router Skills:**
- **wcag-audit-understandable-forms**: Route form input and data collection accessibility requirements (Guideline 3.3)

**Deep Domain Skills:**
- **wcag-audit-understandable-forms-deep**: Form design accessibility rules for user input and data collection

## Contributing

Feel free to contribute! Contributions are welcome.

## License

MIT License - see [LICENSE](LICENSE) file for details.



