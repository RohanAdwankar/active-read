import { NextRequest, NextResponse } from 'next/server';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string; 
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a text string.' },
        { status: 400 }
      );
    }

    // Split text into words, preserving punctuation
    const regex = /([a-zA-Z0-9']+|[.,!?;:"\s])/g;
    const tokens = text.match(regex) || [];
    
    // Convert tokens to Word objects
    const words: Word[] = tokens.map((token, index) => ({
      id: index,
      text: token,
      isBlank: false
    }));
    
    // Identify candidate words for blanking out (words with 4+ characters)
    const candidates = words.filter(word => 
      /^[a-zA-Z]{4,}$/.test(word.text) && !isCommonWord(word.text)
    );
    
    // Select ~15% of candidate words randomly to blank out
    const numberOfBlanks = Math.max(5, Math.floor(candidates.length * 0.15));
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selectedForBlanks = shuffled.slice(0, numberOfBlanks);
    
    // Blank out the selected words
    const processedText: Word[] = words.map(word => {
      if (selectedForBlanks.some(blank => blank.id === word.id)) {
        return {
          ...word,
          isBlank: true,
          originalWord: word.text,
          text: '' // Empty the text field for user input
        };
      }
      return word;
    });
    
    return NextResponse.json({ processedText });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    );
  }
}

// List of common words we don't want to blank out
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 
    'but', 'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 
    'all', 'would', 'there', 'their', 'what', 'out', 'about', 'who',
    'get', 'which', 'when', 'make', 'can', 'like', 'time', 'just', 'him'
  ]);
  
  return commonWords.has(word.toLowerCase());
}
