
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import difflib

router = APIRouter()

@dataclass
class Verse:
    surah: int
    ayah: int
    text: str

class QuranMatcher:
    def __init__(self):
        # Sample verses for demo - complete database would be loaded here
        self.verses = [
            Verse(1, 1, "بسم الله الرحمن الرحيم"),
            Verse(1, 2, "الحمد لله رب العالمين"),
            Verse(2, 1, "الم"),
            Verse(2, 255, "الله لا إله إلا هو الحي القيوم"),
            Verse(112, 1, "قل هو الله أحد"),
            Verse(113, 1, "قل أعوذ برب الفلق"),
            Verse(114, 1, "قل أعوذ برب الناس"),
        ]
        
        self.surahs = [
            {"number": 1, "name": "الفاتحة", "english": "Al-Fatihah"},
            {"number": 2, "name": "البقرة", "english": "Al-Baqarah"},
            {"number": 112, "name": "الإخلاص", "english": "Al-Ikhlas"},
            {"number": 113, "name": "الفلق", "english": "Al-Falaq"},
            {"number": 114, "name": "الناس", "english": "An-Nas"},
        ]
        
    def match_text(self, text: str, threshold: float = 0.3) -> List[Dict]:
        """Find similar verses using sequence matching"""
        results = []
        for verse in self.verses:
            similarity = difflib.SequenceMatcher(None, text, verse.text).ratio()
            if similarity > threshold:
                results.append({"verse": verse, "similarity": similarity})
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:5]

matcher = QuranMatcher()

@router.get("/database")
async def get_quran_database():
    """Get complete Quran database"""
    return {
        "surahs": matcher.surahs,
        "totalSurahs": len(matcher.surahs),
        "totalAyahs": len(matcher.verses)
    }

@router.get("/surahs")
async def get_all_surahs():
    """Get all Surahs"""
    return {"surahs": matcher.surahs}

@router.get("/surah/{surah_number}")
async def get_surah(surah_number: int):
    """Get specific Surah"""
    surah = next((s for s in matcher.surahs if s["number"] == surah_number), None)
    if not surah:
        raise HTTPException(status_code=404, detail="Surah not found")
    
    verses = [v for v in matcher.verses if v.surah == surah_number]
    return {"surah": surah, "verses": verses, "verseCount": len(verses)}

@router.post("/match-verse")
async def match_verse(request: Dict[str, Any]):
    """Match text to Quran verse"""
    text = request.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    matches = matcher.match_text(text)
    if not matches:
        return {"matches": [], "bestMatch": None}
    
    return {
        "text": text,
        "bestMatch": matches[0] if matches else None,
        "alternativeMatches": matches[1:],
        "totalMatches": len(matches)
    }

@router.post("/match-transcription")
async def match_transcription(request: Dict[str, Any]):
    """Match transcription segments to Quran verses"""
    segments = request.get("segments", [])
    matched_segments = []
    
    for segment in segments:
        text = segment.get("text", "")
        matches = matcher.match_text(text, threshold=0.2)
        
        if matches:
            best_match = matches[0]
            matched_segments.append({
                **segment,
                "verse": best_match["verse"],
                "confidence": best_match["similarity"]
            })
        else:
            matched_segments.append({
                **segment,
                "verse": None,
                "confidence": 0
            })
        
    return {
        "segments": matched_segments,
        "matchedCount": sum(1 for s in matched_segments if s["verse"]),
        "totalCount": len(matched_segments)
    }

@router.get("/verse/{surah}/{ayah}")
async def get_verse(surah: int, ayah: int):
    """Get specific verse"""
    verse = next((v for v in matcher.verses if v.surah == surah and v.ayah == ayah), None)
    if not verse:
        raise HTTPException(status_code=404, detail="Verse not found")
    return {"verse": verse}

@router.get("/reciters")
async def get_reciters():
    """Get available reciters"""
    return [
        {"id": "mishari", "name": "Mishari Al-Afasy", "language": "Arabic"},
        {"id": "sudais", "name": "Abdul Rahman Al-Sudais", "language": "Arabic"},
    ]
