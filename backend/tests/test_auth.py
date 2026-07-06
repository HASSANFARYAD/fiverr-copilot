import pytest


@pytest.mark.asyncio
async def test_signup(client):
    resp = await client.post("/auth/signup", json={
        "email": "new@example.com",
        "name": "New User",
        "password": "secure123",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "new@example.com"
    assert data["user"]["name"] == "New User"


@pytest.mark.asyncio
async def test_signup_duplicate_email(client):
    await client.post("/auth/signup", json={
        "email": "dup@example.com",
        "name": "First",
        "password": "pass123",
    })
    resp = await client.post("/auth/signup", json={
        "email": "dup@example.com",
        "name": "Second",
        "password": "pass456",
    })
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login(client):
    await client.post("/auth/signup", json={
        "email": "login@example.com",
        "name": "Login User",
        "password": "mypassword",
    })
    resp = await client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "mypassword",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@example.com"


@pytest.mark.asyncio
async def test_login_invalid(client):
    resp = await client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "wrong",
    })
    assert resp.status_code == 401
    assert "invalid" in resp.json()["detail"].lower()
