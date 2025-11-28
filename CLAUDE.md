# CLAUDE.md - AI Assistant Guide for 75attendance

## Project Overview

**75attendance** is a lightweight web-based attendance calculator that helps students determine:
- How many days they can skip (bunk) while maintaining a target attendance percentage
- How many days they need to attend to reach a target attendance percentage

**Live Site**: https://attendance75.nikhilgeorge.in/
**Author**: Nikhil George
**License**: MIT
**Hosting**: GitHub Pages with custom domain

## Technology Stack

This is a **pure vanilla JavaScript** project with no build system or dependencies:

- **HTML5** - Single page structure (index.html)
- **CSS3** - Custom styling with Inter font family (styles.css)
- **Vanilla JavaScript** - Core calculation logic (app.js)
- **No frameworks, no build tools, no package managers**

### External Services
- **Google Analytics** - Tracking (ID: G-YM7N846T6G)
- **Google Fonts** - Inter font family

## File Structure

```
75attendance/
├── index.html          # Main HTML file with SEO meta tags
├── app.js              # Core calculation logic and DOM manipulation
├── styles.css          # All styling (responsive design included)
├── close.svg           # Banner close button icon
├── CNAME               # GitHub Pages custom domain config
├── LICENSE             # MIT License
└── CLAUDE.md           # This file
```

## Core Functionality

### Main Calculations (app.js)

1. **reqAttendance(present, total, percentage)**
   - Calculates how many days needed to reach target percentage
   - Formula: `Math.ceil((percentage * total - 100 * present) / (100 - percentage))`
   - Location: app.js:41-43

2. **daysToBunk(present, total, percentage)**
   - Calculates how many days can be skipped while maintaining target percentage
   - Formula: `Math.floor((100 * present - percentage * total) / percentage)`
   - Location: app.js:45-47

3. **Input Validation**
   - Checks for positive values and present ≤ total
   - Location: app.js:19-21

### UI Features

- **Percentage Selector**: Dropdown supporting 60%, 65%, 70%, 75%, 80%, 85%, 90%
- **Promotional Banner**: Dismissible banner linking to BunkTrackr (related project)
- **Mobile Footer Fix**: Footer hides when keyboard appears on mobile devices (app.js:74-88)
- **Real-time Calculations**: Click "Calculate" button triggers computation

## Development Conventions

### Commit Message Style

This project follows **Conventional Commits** format:

```
fix: output mismatch for percentages other than 75
add: google analytics script
feat: custom percentages
style: reduced banner size
```

**Prefixes used:**
- `fix:` - Bug fixes
- `add:` - Adding new features or content
- `feat:` - New features
- `style:` - Visual/styling changes

### Git Workflow

1. **Direct commits** to main branch (solo project)
2. **Branch naming** for AI work: `claude/claude-md-<session-id>`
3. **No PR process** required for solo contributions
4. **Push directly** after testing changes locally

### Code Style

- **Indentation**: 2 spaces
- **Naming**: camelCase for variables and functions
- **DOM Selection**: `getElementById()` for element references
- **Event Handling**: `addEventListener()` for all interactions
- **Comments**: Inline comments for complex logic or workarounds (see app.js:71-72)

## SEO & Meta Information

The site has comprehensive meta tags for:
- **Open Graph** (Facebook/LinkedIn sharing)
- **Twitter Cards** (Twitter sharing)
- **Description**: "75 Attendance Calculator. Find out the number of days you should attend to attain 75% attendance or the number of days you can bunk if you have more than 75%"
- **Keywords**: attendance, 75, calculator, percentage, attendance tracker, college attendance, student tracking, bunk, compulsory attendance

## Making Changes

### Testing Changes

Since this is a static site with no build process:

1. Open `index.html` directly in a browser
2. Test all percentage options (60-90%)
3. Test edge cases:
   - present = 0
   - total = 0
   - present > total
   - Different percentage targets
4. Test mobile responsiveness (especially footer behavior)

### Common Tasks

#### Adding a New Percentage Option

1. Edit index.html:78-87 (percentage dropdown)
2. Add new `<option value="XX">XX%</option>`
3. No JavaScript changes needed

#### Modifying Calculations

1. Edit formulas in app.js:41-47
2. Test with known values to verify accuracy
3. Update output text functions if display format changes

#### Styling Updates

1. All styles in styles.css
2. Mobile breakpoint: 480px (navbar) and 800px (footer)
3. Color scheme:
   - Primary: #000 (black)
   - Accent: #2cb67d (green, banner)
   - Links: #0070f3 (blue)
   - Text: #666666 (gray)
   - Borders: #eaeaea (light gray)

#### Analytics Updates

1. Google Analytics ID in index.html:7 and :16
2. gtag.js script loads asynchronously
3. Track new events by adding gtag() calls in app.js

### Known Issues & Workarounds

1. **Footer positioning on mobile**
   - Issue: Footer gets pushed up when keyboard appears
   - Solution: Footer hidden when inputs focused (app.js:74-88)
   - Comment: Marked as "hacky fix" in code

## Deployment

**Automatic deployment** via GitHub Pages:

1. Commit changes to main branch
2. Push to GitHub
3. GitHub Pages automatically deploys from main branch
4. Site updates at https://attendance75.nikhilgeorge.in/

**No build step required** - files are served as-is.

## Best Practices for AI Assistants

### DO:
✓ Test calculations with multiple percentage values
✓ Maintain the simple, dependency-free architecture
✓ Follow the existing commit message format
✓ Preserve mobile responsiveness
✓ Keep the code vanilla (no frameworks)
✓ Update meta tags if changing descriptions
✓ Test on mobile viewport sizes

### DON'T:
✗ Add build tools or package managers
✗ Introduce frameworks (React, Vue, etc.)
✗ Add dependencies without discussion
✗ Break mobile responsiveness
✗ Remove accessibility features
✗ Change calculation formulas without verification
✗ Remove or modify analytics without approval
✗ Push to main branch directly - use feature branches

## Mathematical Verification

When modifying calculations, verify with these test cases:

**Test Case 1: Days to Bunk**
- Present: 80, Total: 100, Target: 75%
- Current: 80% attendance
- Expected: Can bunk 6 days → 80/106 = 75.47%

**Test Case 2: Days to Attend**
- Present: 60, Total: 100, Target: 75%
- Current: 60% attendance
- Expected: Need 60 days → 120/160 = 75%

**Test Case 3: Different Percentage (80%)**
- Present: 70, Total: 100, Target: 80%
- Current: 70% attendance
- Expected: Need 50 days → 120/150 = 80%

## Related Projects

- **BunkTrackr**: https://bunktrackr.nikhilgeorge.in (promoted in banner)

## Support & Issues

- **Source Code**: https://github.com/thegeorgenikhil/75attendance
- **Report Issues**: Use GitHub Issues on the repository

## Recent Development History

Key features and fixes (most recent first):
- Changed Google Analytics tracking ID and meta keywords
- Fixed output mismatch for percentages other than 75%
- Reduced banner size
- Added BunkTrackr promotional banner
- Added Google Analytics integration
- Fixed footer positioning issues on mobile
- Added support for custom percentages (60-90%)
- Implemented bunk day calculations
- Added comprehensive meta tags for SEO

---

**Last Updated**: 2025-11-28
**For AI Assistants**: This file provides context for understanding and modifying the 75attendance codebase. Always verify calculations and test on multiple devices before committing changes.
