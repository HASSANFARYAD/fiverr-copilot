import pytest


@pytest.mark.asyncio
async def test_extension_classify(client):
    resp = await client.post("/extension/classify", json={
        "message": "I need a website built for my business",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["intent_label"] in ["serious", "pricing", "unclear", "low-fit", "spam"]
    assert 0 <= data["confidence"] <= 1


@pytest.mark.asyncio
async def test_extension_reply_draft(client):
    resp = await client.post("/extension/reply-draft", json={
        "message": "How much for a full-stack app?",
        "tone": "professional",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["content"]) > 0
    assert data["confidence"] > 0
