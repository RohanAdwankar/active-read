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
  
  // Extract text differently to avoid type errors
  let contentText = "";
  let foundMainContent = false;
  
  // Try to find main content in one of our preferred selectors
  for (const selector of contentSelectors) {
    if ($(selector).length > 0) {
      contentText = $(selector).text();
      foundMainContent = true;
      break;
    }
  }
  
  // If we didn't find any main content, use the body
  if (!foundMainContent) {
    contentText = $('body').text();
  }
  
  // Clean up the text
  let text = contentText
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n\n')
    .trim();
  
  // If the content is too short, fall back to paragraphs
  if (text.length < 500) {
    // Try using paragraphs instead
    const paragraphs = $('p')
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(p => p.length > 20); // Only keep meaningful paragraphs
    
    if (paragraphs.length > 0) {
      text = paragraphs.join('\n\n');
    }
  }
  
  return text;
}
