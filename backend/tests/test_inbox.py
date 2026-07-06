import pytest


@pytest.mark.asyncio
async def test_list_conversations_empty(auth_client):
    resp = await auth_client.get("/conversations")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_create_and_get_conversation(auth_client, db_session):
    from backend.models.conversation import BuyerConversation, BuyerMessage
    from backend.models.user import User
    from sqlalchemy import select

    user_result = await db_session.execute(select(User).where(User.email == "demo@example.com"))
    user = user_result.scalar_one()

    conv = BuyerConversation(user_id=user.id, buyer_name="John", status="active")
    db_session.add(conv)
    await db_session.commit()
    await db_session.refresh(conv)

    msg = BuyerMessage(conversation_id=conv.id, sender_type="buyer", body="I need a website")
    db_session.add(msg)
    await db_session.commit()

    resp = await auth_client.get(f"/conversations/{conv.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["buyer_name"] == "John"
    assert len(data["messages"]) == 1
    assert data["messages"][0]["body"] == "I need a website"


@pytest.mark.asyncio
async def test_classify_conversation(auth_client, db_session):
    from backend.models.conversation import BuyerConversation, BuyerMessage
    from backend.models.user import User
    from sqlalchemy import select

    user_result = await db_session.execute(select(User).where(User.email == "demo@example.com"))
    user = user_result.scalar_one()

    conv = BuyerConversation(user_id=user.id, buyer_name="Jane", status="active")
    db_session.add(conv)
    await db_session.commit()
    await db_session.refresh(conv)

    resp = await auth_client.post(f"/conversations/{conv.id}/classify")
    assert resp.status_code == 200
    data = resp.json()
    assert data["intent_label"] in ["serious", "pricing", "unclear", "low-fit", "spam"]
    assert 0 <= data["confidence"] <= 1


@pytest.mark.asyncio
async def test_generate_reply_draft(auth_client, db_session):
    from backend.models.conversation import BuyerConversation, BuyerMessage
    from backend.models.user import User
    from sqlalchemy import select

    user_result = await db_session.execute(select(User).where(User.email == "demo@example.com"))
    user = user_result.scalar_one()

    conv = BuyerConversation(user_id=user.id, buyer_name="Alice", status="active")
    db_session.add(conv)
    await db_session.commit()
    await db_session.refresh(conv)

    msg = BuyerMessage(conversation_id=conv.id, sender_type="buyer", body="Can you build a React app?")
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    resp = await auth_client.post(f"/messages/{msg.id}/reply-draft", json={"tone": "professional"})
    assert resp.status_code == 200
    data = resp.json()
    assert "draft_id" in data
    assert len(data["content"]) > 0
    assert data["confidence"] > 0


@pytest.mark.asyncio
async def test_approve_reply(auth_client, db_session):
    from backend.models.conversation import BuyerConversation, BuyerMessage, ReplyDraft
    from backend.models.user import User
    from sqlalchemy import select

    user_result = await db_session.execute(select(User).where(User.email == "demo@example.com"))
    user = user_result.scalar_one()

    conv = BuyerConversation(user_id=user.id, buyer_name="Bob", status="active")
    db_session.add(conv)
    await db_session.commit()
    await db_session.refresh(conv)

    msg = BuyerMessage(conversation_id=conv.id, sender_type="buyer", body="I need help")
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    draft = ReplyDraft(message_id=msg.id, content="Sure, let me help!", confidence=0.95)
    db_session.add(draft)
    await db_session.commit()

    resp = await auth_client.post(f"/messages/{msg.id}/approve-reply")
    assert resp.status_code == 200
    assert resp.json()["approved"] is True
    assert resp.json()["content"] == "Sure, let me help!"


@pytest.mark.asyncio
async def test_approve_reply_not_found(auth_client):
    resp = await auth_client.post("/messages/00000000-0000-0000-0000-000000000000/approve-reply")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_template(auth_client):
    resp = await auth_client.post("/templates", json={
        "type": "greeting",
        "title": "Initial Hello",
        "body": "Hi {{name}}, thanks for your interest!",
        "niche": "general",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Initial Hello"
    assert data["type"] == "greeting"


@pytest.mark.asyncio
async def test_list_templates(auth_client):
    await auth_client.post("/templates", json={"type": "closing", "title": "Thank You", "body": "Thanks!", "niche": "general"})
    resp = await auth_client.get("/templates")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
