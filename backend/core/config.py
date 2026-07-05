from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Fiverr Gig & Inbox Copilot"
    debug: bool = True

    database_url: str = "sqlite+aiosqlite:///./fiverr_copilot.db"

    redis_url: str = ""

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    ai_provider: str = "openai"
    ai_model: str = "llama-3.1-8b-instant"
    ai_api_key: str = ""
    ai_api_base: str = "https://api.groq.com/openai/v1"
    ai_max_tokens: int = 4096
    ai_temperature: float = 0.7

    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
