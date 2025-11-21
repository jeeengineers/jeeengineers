#!/usr/bin/env python3
"""
Script to fix critical SEO issues in Jee Engineers website:
1. Remove .html from canonical URLs
2. Remove .html from og:url meta tags
3. Remove .html from all internal links
4. Add missing canonical tag to thank-you.html
"""

import os
import re
from pathlib import Path

def fix_html_file(filepath):
    """Fix SEO issues in a single HTML file"""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Fix 1: Canonical URL - remove .html extension
    canonical_pattern = r'<link\s+rel="canonical"\s+href="https://jeeengineers\.com/([^"]+)\.html"\s*/>'
    if re.search(canonical_pattern, content):
        content = re.sub(canonical_pattern, r'<link rel="canonical" href="https://jeeengineers.com/\1" />', content)
        changes_made.append("Fixed canonical URL")
    
    # Fix 2: Add canonical tag if missing (for thank-you.html)
    if 'thank-you' in filepath.lower() and 'rel="canonical"' not in content:
        # Find the position after og:image tag
        og_image_pos = content.find('<meta property="og:image"')
        if og_image_pos != -1:
            # Find the end of that line
            line_end = content.find('\n', og_image_pos)
            if line_end != -1:
                canonical_tag = '\n\n  <!-- Canonical URL for SEO -->\n  <link rel="canonical" href="https://jeeengineers.com/thank-you" />'
                content = content[:line_end+1] + canonical_tag + content[line_end+1:]
                changes_made.append("Added missing canonical tag")
    
    # Fix 3: Open Graph URL - remove .html extension
    og_url_pattern = r'<meta\s+property="og:url"\s+content="https://jeeengineers\.com/([^"]+)\.html"\s*/>'
    if re.search(og_url_pattern, content):
        content = re.sub(og_url_pattern, r'<meta property="og:url" content="https://jeeengineers.com/\1" />', content)
        changes_made.append("Fixed og:url")
    
    # Fix 4: Internal links - remove .html extension
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
        print(f"  [OK] Changes made: {', '.join(changes_made)}")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    """Main function to process all HTML files"""
    base_dir = Path(__file__).parent
    
    # List of HTML files to process
    html_files = [
        'blog.html',
        'thank-you.html',
        'faq.html',
        'contact.html',
        'index.html',
        'about.html',
        'products.html',
        # Add more files as needed
    ]
    
    total_fixed = 0
    
    print("=" * 60)
    print("SEO URL Fixer - Removing .html extensions")
    print("=" * 60)
    print()
    
    for filename in html_files:
        filepath = base_dir / filename
        if filepath.exists():
            if fix_html_file(str(filepath)):
                total_fixed += 1
        else:
            print(f"Warning: {filename} not found")
    
    print()
    print("=" * 60)
    print(f"Summary: Fixed {total_fixed} out of {len(html_files)} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
