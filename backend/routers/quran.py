from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pathlib import Path
import json
import re
import difflib
from quran_database import QURAN_DATA, SAMPLE_VERSES, get_quran_text, get_all_surahs

router = APIRouter()

class QuranMatcher:
    def __init__(self):
        self.quran_text = get_quran_text()
        self.surahs = get_all_surahs()
        
    def normalize_arabic(self, text: str) -> str:
        """Normalize Arabic text for comparison"""
        text = re.sub(r'[\u064B-\u065F\u0670]', '', text)  # Remove diacritics
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = text.strip()
        return text
    
    def find_similar_verses(self, text: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Find Quran verses similar to given text"""
        normalized_input = self.normalize_arabic(text)
        results = []
        
        for verse in self.quran_text:
            normalized_verse = self.normalize_arabic(verse["text"])
            
            # Calculate similarity using sequence matcher
            similarity = difflib.SequenceMatcher(None, normalized_input, normalized_verse).ratio()
            
            if similarity > 0.3:  # Minimum similarity threshold
                results.append({
                    "verse": verse,
                    "similarity": similarity,
                    "surah": next(s for s in self.surahs if s["number"] == verse["surahNumber"])
                })
        
        # Sort by similarity and return top results
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]
    
    def match_transcription_segments(self, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Match transcription segments to Quran verses"""
        matched_segments = []
        
        for segment in segments:
            text = segment.get("text", "")
            similar_verses = self.find_similar_verses(text, limit=3)
            
            if similar_verses:
                best_match = similar_verses[0]
                segment_with_verse = {
                    **segment,
                    "verse": best_match["verse"],
                    "verseMatch": {
                        "verse": best_match["verse"],
                        "similarity": best_match["similarity"],
                        "alternativeMatches": [v["verse"] for v in similar_verses[1:]]
                    },
                    "confidence": best_match["similarity"]
                }
            else:
                segment_with_verse = {
                    **segment,
                    "verse": None,
                    "verseMatch": None,
                    "confidence": 0
                }
            
            matched_segments.append(segment_with_verse)
        
        return matched_segments
    
    def get_surah_info(self, surah_number: int) -> Optional[Dict[str, Any]]:
        """Get information about a specific Surah"""
        for surah in self.surahs:
            if surah["number"] == surah_number:
                return surah
        return None
    
    def get_verses_by_surah(self, surah_number: int) -> List[Dict[str, Any]]:
        """Get all verses from a specific Surah"""
        return [v for v in self.quran_text if v["surahNumber"] == surah_number]
    
    def search_verses(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search for verses containing specific text"""
        results = []
        normalized_query = self.normalize_arabic(query)
        
        for verse in self.quran_text:
            normalized_verse = self.normalize_arabic(verse["text"])
            
            if normalized_query in normalized_verse:
                similarity = len(normalized_query) / len(normalized_verse)
                results.append({
                    "verse": verse,
                    "similarity": similarity,
                    "surah": next(s for s in self.surahs if s["number"] == verse["surahNumber"])
                })
        
        # Sort by relevance
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]

matcher = QuranMatcher()

@router.get("/database")
async def get_quran_database():
    """Get complete Quran database"""
    try:
        return {
            "surahs": matcher.surahs,
            "verses": matcher.quran_text,
            "totalSurahs": len(matcher.surahs),
            "totalAyahs": len(matcher.quran_text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load Quran database: {str(e)}")

@router.get("/surahs")
async def get_all_surahs_endpoint():
    """Get all Surahs"""
    try:
        return {"surahs": matcher.surahs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load surahs: {str(e)}")

@router.get("/surah/{surah_number}")
async def get_surah(surah_number: int):
    """Get specific Surah"""
    try:
        surah = matcher.get_surah_info(surah_number)
        if not surah:
            raise HTTPException(status_code=404, detail="Surah not found")
        
        verses = matcher.get_verses_by_surah(surah_number)
        
        return {
            "surah": surah,
            "verses": verses,
            "verseCount": len(verses)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get surah: {str(e)}")

@router.post("/match-verse")
async def match_verse(request: Dict[str, Any]):
    """Match text to Quran verse"""
    try:
        text = request.get("text", "")
        limit = request.get("limit", 5)
        
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")
        
        similar_verses = matcher.find_similar_verses(text, limit)
        
        if not similar_verses:
            return {"matches": [], "bestMatch": None}
        
        best_match = similar_verses[0]
        
        return {
            "text": text,
            "bestMatch": {
                "verse": best_match["verse"],
                "similarity": best_match["similarity"],
                "surah": best_match["surah"]
            },
            "alternativeMatches": similar_verses[1:],
            "totalMatches": len(similar_verses)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to match verse: {str(e)}")

@router.post("/match-transcription")
async def match_transcription(request: Dict[str, Any]):
    """Match transcription segments to Quran verses"""
    try:
        segments = request.get("segments", [])
        
        if not segments:
            raise HTTPException(status_code=400, detail="No segments provided")
        
        matched_segments = matcher.match_transcription_segments(segments)
        
        return {
            "segments": matched_segments,
            "matchedCount": sum(1 for s in matched_segments if s["verse"]),
            "totalCount": len(matched_segments)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to match transcription: {str(e)}")

@router.post("/search-verse")
async def search_verses_endpoint(request: Dict[str, Any]):
    """Search verses containing specific text"""
    try:
        query = request.get("query", "")
        limit = request.get("limit", 10)
        
        if not query:
            raise HTTPException(status_code=400, detail="No query provided")
        
        results = matcher.search_verses(query, limit)
        
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search verses: {str(e)}")

@router.get("/verse/{surah}/{ayah}")
async def get_verse(surah: int, ayah: int):
    """Get specific verse (Ayah)"""
    try:
        for verse in matcher.quran_text:
            if verse["surahNumber"] == surah and verse["ayahNumber"] == ayah:
                surah_info = matcher.get_surah_info(surah)
                return {
                    "verse": verse,
                    "surah": surah_info
                }
        
        raise HTTPException(status_code=404, detail="Verse not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get verse: {str(e)}")

@router.get("/juz/{juz_number}")
async def get_juz(juz_number: int):
    """Get verses in a specific Juz (para)"""
    try:
        if not 1 <= juz_number <= 30:
            raise HTTPException(status_code=400, detail="Juz must be between 1 and 30")
        
        verses = [v for v in matcher.quran_text if v.get("juz") == juz_number]
        
        # Group by surah
        surahs_data = {}
        for verse in verses:
            surah_num = verse["surahNumber"]
            if surah_num not in surahs_data:
                surah_info = matcher.get_surah_info(surah_num)
                surahs_data[surah_num] = {
                    "surah": surah_info,
                    "verses": []
                }
            surahs_data[surah_num]["verses"].append(verse)
        
        return {
            "juz": juz_number,
            "surahs": list(surahs_data.values()),
            "totalVerses": len(verses)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get juz: {str(e)}")

@router.post("/verse-audio")
async def get_verse_audio_url(request: Dict[str, Any]):
    """Get audio URL for a verse"""
    try:
        surah = request.get("surah")
        ayah = request.get("ayah")
        reciter = request.get("reciter", "mishari")
        
        if not surah or not ayah:
            raise HTTPException(status_code=400, detail="Surah and ayah numbers required")
        
        # In production, would generate actual audio URL
        # For demo, return mock URL
        audio_url = f"https://quran.com/api/audio/{reciter}/{surah}_{ayah}.mp3"
        
        return {
            "audioUrl": audio_url,
            "surah": surah,
            "ayah": ayah,
            "reciter": reciter
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get verse audio: {str(e)}")

@router.get("/reciters")
async def get_reciters():
    """Get available reciters"""
    return [
        {"id": "mishari", "name": "Mishari Al-Afasy", "language": "Arabic"},
        {"id": "sudais", "name": "Abdul Rahman Al-Sudais", "language": "Arabic"},
        {"id": "shuraim", "name": "Saud Al-Shuraim", "language": "Arabic"},
        {"id": "minshawi", "name": "Mahmoud Khalil Al-Husary", "language": "Arabic"},
        {"id": "basit", "name": "Abdul Basit Abdul Samad", "language": "Arabic"}
    ]