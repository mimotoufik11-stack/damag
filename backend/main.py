from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Optional

app = FastAPI(title="Dammaj Al-Quran API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Surah(BaseModel):
    number: int
    name: str
    englishName: str
    englishNameTranslation: str
    numberOfAyahs: int
    revelationType: str

class Ayah(BaseModel):
    number: int
    text: str
    numberInSurah: int
    juz: int
    page: int

# Sample Quran data (in production, this would come from a database or files)
surahs_data = [
    {
        "number": 1,
        "name": "الفاتحة",
        "englishName": "Al-Fatiha",
        "englishNameTranslation": "The Opening",
        "numberOfAyahs": 7,
        "revelationType": "Meccan"
    },
    {
        "number": 2,
        "name": "البقرة",
        "englishName": "Al-Baqara",
        "englishNameTranslation": "The Cow",
        "numberOfAyahs": 286,
        "revelationType": "Medinan"
    },
    {
        "number": 3,
        "name": "آل عمران",
        "englishName": "Ali 'Imran",
        "englishNameTranslation": "Family of Imran",
        "numberOfAyahs": 200,
        "revelationType": "Medinan"
    },
    # Add more surahs as needed...
]

sample_ayahs = {
    1: [
        {"number": 1, "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "numberInSurah": 1, "juz": 1, "page": 1},
        {"number": 2, "text": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "numberInSurah": 2, "juz": 1, "page": 1},
        {"number": 3, "text": "الرَّحْمَٰنِ الرَّحِيمِ", "numberInSurah": 3, "juz": 1, "page": 1},
        {"number": 4, "text": "مَالِكِ يَوْمِ الدِّينِ", "numberInSurah": 4, "juz": 1, "page": 1},
        {"number": 5, "text": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "numberInSurah": 5, "juz": 1, "page": 1},
        {"number": 6, "text": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "numberInSurah": 6, "juz": 1, "page": 1},
        {"number": 7, "text": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "numberInSurah": 7, "juz": 1, "page": 1},
    ]
}

@app.get("/")
async def root():
    return {
        "message": "Dammaj Al-Quran API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/surahs", response_model=List[Surah])
async def get_surahs():
    """Get list of all surahs"""
    return surahs_data

@app.get("/api/surah/{surah_number}", response_model=Surah)
async def get_surah(surah_number: int):
    """Get specific surah by number"""
    surah = next((s for s in surahs_data if s["number"] == surah_number), None)
    if not surah:
        raise HTTPException(status_code=404, detail="Surah not found")
    return surah

@app.get("/api/surah/{surah_number}/ayahs", response_model=List[Ayah])
async def get_ayahs(surah_number: int):
    """Get all ayahs of a specific surah"""
    if surah_number not in sample_ayahs:
        # Return empty list for surahs without sample data
        return []
    return sample_ayahs[surah_number]

@app.get("/api/ayah/{ayah_number}", response_model=Ayah)
async def get_ayah(ayah_number: int):
    """Get specific ayah by its number in the Quran"""
    # This is simplified; in production, you'd have a proper ayah lookup
    for surah_ayahs in sample_ayahs.values():
        ayah = next((a for a in surah_ayahs if a["number"] == ayah_number), None)
        if ayah:
            return ayah
    raise HTTPException(status_code=404, detail="Ayah not found")

@app.get("/api/search")
async def search_quran(q: str):
    """Search in the Quran"""
    results = []
    for surah_num, ayahs in sample_ayahs.items():
        for ayah in ayahs:
            if q in ayah["text"]:
                results.append({
                    "surah": next((s for s in surahs_data if s["number"] == surah_num), None),
                    "ayah": ayah
                })
    return {"query": q, "results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
