import { NextRequest, NextResponse } from 'next/server';
import wtf from 'wtf_wikipedia'

export async function POST(req: NextRequest) {
    // Step 1: Get a random article title using the Wikipedia API
    // https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=1
    
    const randomArticleUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=1';

    const response = await fetch(randomArticleUrl);
    if (!response.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch random article.' },
            { status: 500 }
        );
    } else {
        const data = await response.json();
        const pageId = Object.keys(data.query.pages)[0];
        const articleTitle = data.query.pages[pageId].title;
        const articleContent = data.query.pages[pageId].revisions[0]['*'];
        console.log('Article Title:', articleTitle);
        const stripped = wtf(articleContent).text();
        console.log('Stripped Content:', stripped);

        return NextResponse.json({
            title: articleTitle,
            content: stripped,
        });
    }
}
