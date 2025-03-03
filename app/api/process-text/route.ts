import { NextRequest, NextResponse } from 'next/server';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string; 
}

export async function POST(req: NextRequest) {
  try {
    const { text, blankFrequency = 15, onlyImportantWords = true } = await req.json();
    
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
    
    // Determine candidates based on the onlyImportantWords setting
    let candidates: Word[];
    
    if (onlyImportantWords) {
      // Filter for important words (longer than 3 chars and not common)
      candidates = words.filter(word => 
        /^[a-zA-Z]{4,}$/.test(word.text) && !isCommonWord(word.text)
      );
    } else {
      // Consider all actual words (not punctuation or whitespace)
      candidates = words.filter(word => /^[a-zA-Z]+$/.test(word.text));
    }
    
    // Use the blankFrequency parameter from the request
    const frequency = blankFrequency / 100;
    const numberOfBlanks = Math.max(5, Math.floor(candidates.length * frequency));
    
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    
    // Select non-consecutive blanks
    const selectedForBlanks: Word[] = [];
    const selectedIds = new Set<number>();
    
    // Helper function to check if adding this word would create consecutive blanks
    const wouldCreateConsecutiveBlanks = (wordId: number): boolean => {
      // Find the actual position in the words array
      const position = words.findIndex(w => w.id === wordId);
      
      // Check previous word (if it exists)
      if (position > 0) {
        const prevWordId = words[position - 1].id;
        if (selectedIds.has(prevWordId)) return true;
      }
      
      // Check next word (if it exists)
      if (position < words.length - 1) {
        const nextWordId = words[position + 1].id;
        if (selectedIds.has(nextWordId)) return true;
      }
      
      return false;
    };
    
    // Select candidates that don't create consecutive blanks
    for (const candidate of shuffled) {
      if (selectedForBlanks.length >= numberOfBlanks) break;
      
      if (!wouldCreateConsecutiveBlanks(candidate.id)) {
        selectedForBlanks.push(candidate);
        selectedIds.add(candidate.id);
      }
    }
    
    // If we don't have enough blanks, make another pass with less strict criteria
    if (selectedForBlanks.length < numberOfBlanks) {
      for (const candidate of shuffled) {
        if (selectedForBlanks.length >= numberOfBlanks) break;
        if (!selectedIds.has(candidate.id)) {
          selectedForBlanks.push(candidate);
          selectedIds.add(candidate.id);
        }
      }
    }
    
    // Blank out the selected words
    const processedText: Word[] = words.map(word => {
      if (selectedIds.has(word.id)) {
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
