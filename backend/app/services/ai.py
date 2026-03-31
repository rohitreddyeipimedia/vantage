from openai import OpenAI
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.brand import Brand
from app.models.ad import Ad
from app.models.brief import WeeklyBrief
from app.models.competitor import Competitor

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_weekly_brief(brand_id: str):
    """Generate AI weekly intelligence brief for a brand."""
    db: Session = SessionLocal()
    try:
        brand = db.query(Brand).filter(Brand.id == brand_id).first()
        if not brand:
            return

        week_end = datetime.utcnow()
        week_start = week_end - timedelta(days=7)
        prev_week_start = week_start - timedelta(days=7)

        competitor_ids = [c.id for c in brand.competitors]
        if not competitor_ids:
            return

        # Gather this week's ads
        this_week_ads = db.query(Ad).filter(
            Ad.competitor_id.in_(competitor_ids),
            Ad.created_at >= week_start
        ).all()

        # Gather last week's ads
        last_week_ads = db.query(Ad).filter(
            Ad.competitor_id.in_(competitor_ids),
            Ad.created_at >= prev_week_start,
            Ad.created_at < week_start
        ).all()

        # Build competitor summaries
        competitor_summary = []
        for comp in brand.competitors:
            comp_ads_this_week = [a for a in this_week_ads if a.competitor_id == comp.id]
            comp_ads_last_week = [a for a in last_week_ads if a.competitor_id == comp.id]
            surge_ads = [a for a in comp_ads_this_week if a.spend_signal in ["high", "surge"]]
            competitor_summary.append(
                f"- {comp.name}: {len(comp_ads_this_week)} new ads this week "
                f"(vs {len(comp_ads_last_week)} last week). "
                f"{len(surge_ads)} high/surge spend signals. "
                f"Formats: {', '.join(set(a.format for a in comp_ads_this_week if a.format)) or 'none'}."
            )

        prompt = f"""You are a senior brand strategist and competitive intelligence analyst.
Generate a professional weekly competitive intelligence brief for {brand.name}, a {brand.category or 'consumer'} brand.

COMPETITOR ACTIVITY THIS WEEK:
{chr(10).join(competitor_summary)}

TOTAL NEW ADS THIS WEEK: {len(this_week_ads)}
TOTAL NEW ADS LAST WEEK: {len(last_week_ads)}
WEEK OF: {week_start.strftime('%B %d')} - {week_end.strftime('%B %d, %Y')}

Generate a professional intelligence brief with:
1. Executive Summary (2-3 sentences capturing the week's competitive landscape)
2. Key Observations (one paragraph per competitor with specific insights)
3. Emerging Trends (patterns across competitors)
4. Strategic Recommendations (exactly 3 specific, actionable recommendations for {brand.name})

Write as a confident senior analyst — direct, no hedging, no filler. Professional but not robotic.
Format in clean markdown with ## headings."""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )

        content = response.choices[0].message.content

        # Extract key insights and recommendations from the content
        insights = [f"{comp.name} ran {len([a for a in this_week_ads if a.competitor_id == comp.id])} ads this week"
                    for comp in brand.competitors]
        recommendations = [
            "Monitor high-spend competitors for farly signals of campaign pivots",
            "Test formats your competitors are doubling down on",
            "Capture share of voice when competitors go dark"
        ]

        brief = WeeklyBrief(
            brand_id=brand_id,
            week_start=week_start,
            week_end=week_end,
            content=content,
            key_insights=insights,
            recommendations=recommendations
        )
        db.add(brief)
        db.commit()

    except Exception as e:
        print(f"Brief generation error: {e}")
    finally:
        db.close()

async def analyze_creative(image_url: str) -> dict:
    """Use GPT-4o Vision to analyze an ad creative."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": """Analyze this ad creative and return JSON with:
- format: image/video/carousel
- has_human: true/false
- emotional_tone: aspirational/urgent/informational/humorous/emotional
- text_overlay: any text visible in the image
- cta_visible: true/false
- product_visible: true/false
- visual_style: minimalist/lifestyle/product-focused/social-proof/dramatic
Return only valid JSON."""}
                ]
            }],
            max_tokens=300
        )
        import json
        return json.loads(response.choices[0].message.content)
    except:
        return {}
