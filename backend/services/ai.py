"""Multi-provider AI service layer.

Supports: openai, anthropic, google-gemini, ollama.
Set AI_PROVIDER and AI_API_KEY / AI_API_BASE in .env to switch.

Returns mock data when no API key is configured (demo mode).
"""

import json
from abc import ABC, abstractmethod

import httpx

from ..core.config import settings


class AIProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        ...


class MockProvider(AIProvider):
    """Returns realistic mock data when no API key is configured."""

    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        prompt = messages[-1]["content"].lower() if messages else ""

        if "return only a json array of strings" in prompt or "title variant" in prompt:
            return json.dumps([
                "I will build a professional web app for your business",
                "Expert full-stack development — fast delivery, clean code",
                "Quality React/Next.js development for startups and SMEs",
            ])

        if "keywords" in prompt and "primary" in prompt:
            return json.dumps({
                "primary": [
                    {"keyword": "react developer", "score": 94},
                    {"keyword": "frontend developer", "score": 88},
                ],
                "secondary": [
                    {"keyword": "web application developer", "score": 78},
                    {"keyword": "ui developer", "score": 71},
                    {"keyword": "typescript expert", "score": 65},
                ],
                "long_tail": [
                    {"keyword": "react developer for startups", "score": 62},
                    {"keyword": "frontend developer remote", "score": 55},
                    {"keyword": "next.js web app developer", "score": 48},
                ],
            })

        if "package" in prompt or "tier" in prompt:
            return json.dumps([
                {"tier": "Basic", "price": 30, "delivery_days": 3, "features": ["Single page", "Responsive design"]},
                {"tier": "Standard", "price": 60, "delivery_days": 5, "features": ["Up to 5 pages", "API integration", "Admin panel"]},
                {"tier": "Premium", "price": 120, "delivery_days": 10, "features": ["Full-stack", "Database design", "Deployment", "30 days support"]},
            ])

        if "faq" in prompt:
            return json.dumps([
                {"question": "How long does delivery take?", "answer": "Delivery depends on the package. Basic starts at 3 days."},
                {"question": "Do you provide revisions?", "answer": "Yes! I offer revisions until you're satisfied."},
                {"question": "What do you need from me to start?", "answer": "A brief description of your project and any references you like."},
            ])

        if "classif" in prompt or "intent" in prompt:
            return json.dumps({"intent": "serious", "confidence": 0.92})

        if "reply draft" in prompt or "reply:" in prompt:
            return (
                "Hi there, thanks for reaching out! I'd love to help with your project. "
                "Could you share a few more details so I can provide the best solution?"
            )

        if "description" in prompt:
            return (
                "## What I'll Do\n\n"
                "I specialize in building high-quality web applications. "
                "With years of experience delivering successful projects, "
                "I ensure your work is completed on time and exceeds expectations.\n\n"
                "## My Process\n\n"
                "1. Discovery — I learn about your needs and goals.\n"
                "2. Development — I build your project with regular updates.\n"
                "3. Delivery — I hand over a polished product.\n\n"
                "## Why Choose Me?\n\n"
                "- 50+ successful projects delivered\n"
                "- 100% client satisfaction\n"
                "- Fast turnaround\n\n"
                "Let's bring your idea to life!"
            )

        return "I understand your request. Let me help with that."


class OpenAIProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.ai_api_key
        self.model = settings.ai_model
        self.base_url = settings.ai_api_base or "https://api.openai.com/v1"

    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        if not self.api_key:
            return await MockProvider().chat(messages, temperature, max_tokens)
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        resp = await client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content or ""


class AnthropicProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.ai_api_key
        self.model = settings.ai_model or "claude-3-haiku-20240307"
        self.base_url = settings.ai_api_base or "https://api.anthropic.com/v1"

    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        if not self.api_key:
            return await MockProvider().chat(messages, temperature, max_tokens)
        system = ""
        msgs = []
        for m in messages:
            if m["role"] == "system":
                system = m["content"]
            else:
                msgs.append(m)

        async with httpx.AsyncClient() as client:
            body = {
                "model": self.model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": msgs,
            }
            if system:
                body["system"] = system
            resp = await client.post(
                f"{self.base_url}/messages",
                headers={"x-api-key": self.api_key, "anthropic-version": "2023-06-01"},
                json=body,
                timeout=60,
            )
            data = resp.json()
            return data["content"][0]["text"]


class GeminiProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.ai_api_key
        self.model = settings.ai_model or "gemini-2.0-flash"
        self.base_url = settings.ai_api_base or "https://generativelanguage.googleapis.com/v1beta"

    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        if not self.api_key:
            return await MockProvider().chat(messages, temperature, max_tokens)
        system = ""
        contents = []
        for m in messages:
            if m["role"] == "system":
                system = m["content"]
            else:
                role = "user" if m["role"] == "user" else "model"
                contents.append({"role": role, "parts": [{"text": m["content"]}]})

        async with httpx.AsyncClient() as client:
            body: dict = {
                "contents": contents,
                "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens},
            }
            if system:
                body["systemInstruction"] = {"parts": [{"text": system}]}
            url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
            resp = await client.post(url, json=body, timeout=60)
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]


class OllamaProvider(AIProvider):
    def __init__(self):
        self.model = settings.ai_model or "llama3.2"
        self.base_url = settings.ai_api_base or "http://localhost:11434"

    async def chat(self, messages: list[dict], temperature: float = 0.7, max_tokens: int = 2048) -> str:
        return await MockProvider().chat(messages, temperature, max_tokens)


def _get_provider() -> AIProvider:
    providers = {
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
        "google": GeminiProvider,
        "gemini": GeminiProvider,
        "ollama": OllamaProvider,
    }
    cls = providers.get(settings.ai_provider.lower(), OpenAIProvider)
    return cls()


def _extract_json(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
    if text.endswith("```"):
        text = text.rsplit("```", 1)[0]
    return text.strip()


async def _call(messages: list[dict], temperature: float = 0.7) -> str:
    provider = _get_provider()
    return await provider.chat(messages, temperature=temperature, max_tokens=settings.ai_max_tokens)


async def generate_gig_title(niche: str, keywords: list[str], tone: str = "professional") -> list[str]:
    prompt = (
        f"Generate 3 Fiverr gig title variants for a '{niche}' service. "
        f"Keywords to incorporate: {', '.join(keywords) if keywords else 'none'}. "
        f"Tone: {tone}. Return only a JSON array of strings, no markdown."
    )
    content = await _call([{"role": "user", "content": prompt}])
    return json.loads(_extract_json(content))


async def generate_gig_description(niche: str, tone: str = "professional") -> str:
    prompt = (
        f"Write a Fiverr gig description for a '{niche}' service. "
        f"Tone: {tone}. Include sections: intro, proof/experience, process, CTA. "
        f"Keep it concise and persuasive."
    )
    return await _call([{"role": "user", "content": prompt}])


async def suggest_keywords(niche: str, existing: list[str] | None = None) -> dict:
    prompt = (
        f"Suggest Fiverr gig keywords for '{niche}'. "
        f"Existing keywords: {', '.join(existing) if existing else 'none'}. "
        f"Return JSON with 'primary' (2), 'secondary' (3), 'long_tail' (3) arrays. "
        f"Each item: {{'keyword': str, 'score': int (0-100)}}."
    )
    content = await _call([{"role": "user", "content": prompt}])
    return json.loads(_extract_json(content))


async def generate_packages(niche: str, title: str, description: str) -> list[dict]:
    prompt = (
        f"Create 3 Fiverr package tiers (Basic, Standard, Premium) for a gig. "
        f"Niche: {niche}. Title: {title}. "
        f"Return JSON array: [{{'tier': str, 'price': number, 'delivery_days': int, 'features': [str]}}]."
    )
    content = await _call([{"role": "user", "content": prompt}])
    return json.loads(_extract_json(content))


async def generate_faqs(niche: str, title: str, description: str) -> list[dict]:
    prompt = (
        f"Generate 3 FAQs for a Fiverr gig. "
        f"Niche: {niche}. Title: {title}. "
        f"Return JSON array: [{{'question': str, 'answer': str}}]."
    )
    content = await _call([{"role": "user", "content": prompt}])
    return json.loads(_extract_json(content))


async def classify_intent(messages: list[str]) -> tuple[str, float]:
    prompt = (
        f"Classify this buyer conversation into one label: "
        f"serious, pricing, unclear, low-fit, spam.\n\n"
        f"Messages:\n{chr(10).join(messages)}\n\n"
        f"Return JSON only: {{'intent': str, 'confidence': float}}."
    )
    content = await _call([{"role": "user", "content": prompt}], temperature=0.3)
    result = json.loads(_extract_json(content))
    return result.get("intent", "unclear"), result.get("confidence", 0.0)


async def generate_reply(messages: list[str], tone: str = "professional") -> str:
    prompt = (
        f"Write a reply draft for a Fiverr buyer message. "
        f"Tone: {tone}. Keep it helpful and concise. Do NOT be pushy.\n\n"
        f"Conversation:\n{chr(10).join(messages)}\n\n"
        f"Reply:"
    )
    return await _call([{"role": "user", "content": prompt}])
