from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str
    secret_key: str
    database_url: str

    qdrant_url: str
    qdrant_api_key: str
    qdrant_collection: str = "enterprise_knowledge"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()