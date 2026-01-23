---
description: Create a new blog post with proper MDX structure and metadata
---

# Create New Blog Post

Create a new blog post in the `content/blog/` directory with the correct structure.

## Instructions

1. **Gather information** - Ask the user for:
   - Post title (required)
   - Post slug (required, kebab-case, e.g., `my-new-post`)
   - Year (default: current year)
   - Excerpt/description (optional)
   - Cover image URL (optional)
   - Cover icon/emoji (optional)
   - Is it a gallery/image-focused post? (default: false)
   - Is it featured? (default: false)

2. **Create the directory structure**:
   ```
   content/blog/{year}/{slug}/
   ├── page.mdx
   └── resources/     # Create if user has images
   ```

3. **Generate the MDX file** with this format:
   ```tsx
   export const metadata = {
     title: 'Post Title',
     excerpt: 'Brief description...',  // optional
     publishDate: '2024-01-15T12:00:00.000Z',  // ISO 8601 UTC
     isFeatured: false,
     isGalleryView: false,
     coverImage: './resources/cover.jpg',  // optional
     coverIcon: '📝',  // optional
   }

   # Post Title

   Your content here...
   ```

4. **Important notes**:
   - Use ISO 8601 format for `publishDate` with current timestamp
   - Keep `isGalleryView` spelling (legacy typo in schema)
   - Images go in `./resources/` directory with relative paths
   - The file must be named `page.mdx`

## Available MDX Components

Remind user of available components:
- `<Callout icon="💡">Content</Callout>` - Styled callout boxes
- `<Details summary="Click to expand">Hidden content</Details>` - Collapsible sections
- `<Video src="https://youtube.com/..." />` - YouTube/Vimeo embeds
- `<MDXImage src="./resources/image.jpg" />` - Images with relative paths
- `<LinkPreview url="https://..." />` - Link preview embeds

## Example Output

For a post titled "My New Post" with slug "my-new-post" in 2024:

```
Created: content/blog/2024/my-new-post/page.mdx
```
