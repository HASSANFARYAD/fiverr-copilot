import pytest

from backend.services.ai import (
    MockProvider,
    generate_gig_title,
    generate_gig_description,
    suggest_keywords,
    generate_packages,
    generate_faqs,
    classify_intent,
    generate_reply,
)


@pytest.mark.asyncio
async def test_generate_gig_title():
    titles = await generate_gig_title("Web Development", ["react", "nextjs"])
    assert isinstance(titles, list)
    assert len(titles) == 3
    assert all(isinstance(t, str) for t in titles)


@pytest.mark.asyncio
async def test_generate_gig_description():
    desc = await generate_gig_description("Web Development")
    assert isinstance(desc, str)
    assert len(desc) > 50


@pytest.mark.asyncio
async def test_suggest_keywords():
    result = await suggest_keywords("Web Development")
    assert "primary" in result
    assert "secondary" in result
    assert "long_tail" in result
    assert len(result["primary"]) == 2
    assert len(result["secondary"]) == 3


@pytest.mark.asyncio
async def test_generate_packages():
    packages = await generate_packages("Web Dev", "I build websites", "Full service")
    assert isinstance(packages, list)
    assert len(packages) == 3
    for pkg in packages:
        assert "tier" in pkg
        assert "price" in pkg
        assert "features" in pkg


@pytest.mark.asyncio
async def test_generate_faqs():
    faqs = await generate_faqs("Web Dev", "I build websites", "Full service")
    assert isinstance(faqs, list)
    assert len(faqs) == 3
    for faq in faqs:
        assert "question" in faq
        assert "answer" in faq


@pytest.mark.asyncio
async def test_classify_intent():
    intent, confidence = await classify_intent(["I need a website for my bakery business"])
    assert intent in ["serious", "pricing", "unclear", "low-fit", "spam"]
    assert 0 <= confidence <= 1


@pytest.mark.asyncio
async def test_generate_reply():
    reply = await generate_reply(["How much do you charge for a landing page?"])
    assert isinstance(reply, str)
    assert len(reply) > 10


@pytest.mark.asyncio
async def test_mock_provider_chat():
    provider = MockProvider()
    resp = await provider.chat([{"role": "user", "content": "classify this message"}])
    assert "intent" in resp
