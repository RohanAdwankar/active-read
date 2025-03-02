import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the content from the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: 500 }
      );
    }

    const html = await response.text();
    
    // Use cheerio to extract text content
    const textContent = extractTextFromHTML(html);
    
    return NextResponse.json({ text: textContent });
  } catch (error) {
    console.error('Error scraping URL:', error);
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    );
  }
}

function extractTextFromHTML(html: string): string {
  const $ = cheerio.load(html);
  
  // Remove script and style elements
  $('script, style, noscript, iframe, svg').remove();
  
  // Focus on the content area - try to find main content elements
  const contentSelectors = [
    'article', 'main', '.content', '.post-content', '.article-content',
    '#content', '.main-content', '[role="main"]'
  ];
  
  let $content = $('body');
  
  // Try to find main content element
  for (const selector of contentSelectors) {
    if ($(selector).length > 0) {
      // Select the first matching element
      $content = $(selector).first();
      break;
    }
  }
  
  // Get text and clean it
  let text = $content.text()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n\n')
    .trim();
  
  // If the content is too short (probably failed to find main content),
  // fall back to full body
  if (text.length < 500 && $content.is('body')) {
    // Try using paragraphs instead
    const paragraphs = $('p')
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(p => p.length > 20); // Only keep non-empty paragraphs
    
    text = paragraphs.join('\n\n');
  }
  
  return text;
}
