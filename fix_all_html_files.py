#!/usr/bin/env python3
"""
Comprehensive script to fix ALL HTML files in the directory
"""

import os
import re
from pathlib import Path

def fix_html_file(filepath):
    """Fix SEO issues in a single HTML file"""
    print(f"Processing: {filepath.name}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Fix 1: Canonical URL - remove .html extension
    canonical_pattern = r'<link\s+rel="canonical"\s+href="https://jeeengineers\.com/([^"]+)\.html"\s*/>'
    if re.search(canonical_pattern, content):
        content = re.sub(canonical_pattern, r'<link rel="canonical" href="https://jeeengineers.com/\1" />', content)
        changes_made.append("Fixed canonical URL")
    
    # Fix 2: Open Graph URL - remove .html extension
    og_url_pattern = r'<meta\s+property="og:url"\s+content="https://jeeengineers\.com/([^"]+)\.html"\s*/>'
    if re.search(og_url_pattern, content):
        content = re.sub(og_url_pattern, r'<meta property="og:url" content="https://jeeengineers.com/\1" />', content)
        changes_made.append("Fixed og:url")
    
    # Fix 3: Internal links - remove .html extension
    # Pattern for href="filename.html" (but not external links or #)
    internal_link_pattern = r'href="([a-zA-Z0-9_-]+)\.html"'
    matches = re.findall(internal_link_pattern, content)
    if matches:
        content = re.sub(internal_link_pattern, r'href="\1"', content)
        changes_made.append(f"Fixed {len(set(matches))} internal links")
    
    # Write back if changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] Changes: {', '.join(changes_made)}")
        return True
    else:
        print(f"  [SKIP] No changes needed")
        return False

def main():
    """Main function to process all HTML files"""
    base_dir = Path(__file__).parent
    
    # Find all HTML files in the directory
    html_files = list(base_dir.glob('*.html'))
    
    total_fixed = 0
    
    print("=" * 70)
    print("SEO URL Fixer - Removing .html extensions from ALL HTML files")
    print("=" * 70)
    print(f"Found {len(html_files)} HTML files\n")
    
    for filepath in sorted(html_files):
        if fix_html_file(filepath):
            total_fixed += 1
    
    print()
    print("=" * 70)
    print(f"Summary: Fixed {total_fixed} out of {len(html_files)} files")
    print("=" * 70)

if __name__ == "__main__":
    main()
