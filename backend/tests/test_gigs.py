import pytest


@pytest.mark.asyncio
async def test_create_gig_draft(auth_client):
    resp = await auth_client.post("/gigs/draft", json={
        "niche": "Web Development",
        "keywords": "react, nodejs, typescript, mongo, graphql",
        "tone": "professional",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["niche"] == "Web Development"
    assert data["status"] == "draft"
    assert len(data["keywords"]) == 5
    assert len(data["packages"]) == 3


@pytest.mark.asyncio
async def test_list_gig_drafts(auth_client):
    await auth_client.post("/gigs/draft", json={"niche": "Design", "keywords": "figma, ui"})
    await auth_client.post("/gigs/draft", json={"niche": "Writing", "keywords": "copy, blog"})
    resp = await auth_client.get("/gigs")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    niches = {g["niche"] for g in data}
    assert niches == {"Design", "Writing"}


@pytest.mark.asyncio
async def test_get_gig_draft(auth_client):
    create_resp = await auth_client.post("/gigs/draft", json={"niche": "SEO", "keywords": "seo, marketing"})
    draft_id = create_resp.json()["id"]
    resp = await auth_client.get(f"/gigs/{draft_id}")
    assert resp.status_code == 200
    assert resp.json()["niche"] == "SEO"


@pytest.mark.asyncio
async def test_get_gig_draft_not_found(auth_client):
    resp = await auth_client.get("/gigs/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_gig_draft(auth_client):
    create_resp = await auth_client.post("/gigs/draft", json={"niche": "Mobile Dev", "keywords": "swift"})
    draft_id = create_resp.json()["id"]
    resp = await auth_client.patch(f"/gigs/{draft_id}", json={
        "title": "Expert iOS Developer",
        "description": "Building beautiful apps.",
    })
    assert resp.status_code == 200
    assert resp.json()["title"] == "Expert iOS Developer"
    assert resp.json()["description"] == "Building beautiful apps."


@pytest.mark.asyncio
async def test_score_gig_draft(auth_client):
    create_resp = await auth_client.post("/gigs/draft", json={"niche": "Data Science", "keywords": "python, ml"})
    draft_id = create_resp.json()["id"]
    resp = await auth_client.post(f"/gigs/{draft_id}/score")
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data
    assert 0 <= data["score"] <= 100
    assert len(data["checklist"]) == 5


@pytest.mark.asyncio
async def test_publish_checklist(auth_client):
    create_resp = await auth_client.post("/gigs/draft", json={"niche": "DevOps", "keywords": "docker, k8s"})
    draft_id = create_resp.json()["id"]
    resp = await auth_client.post(f"/gigs/{draft_id}/publish-checklist")
    assert resp.status_code == 200
    assert "score" in resp.json()
