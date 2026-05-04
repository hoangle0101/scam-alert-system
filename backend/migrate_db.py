from sqlalchemy import create_engine, text
from app.core.config import get_settings

def migrate():
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        print(f"Connecting to {settings.DATABASE_URL}...")
        conn.execute(text("ALTER TABLE scan_results ADD COLUMN IF NOT EXISTS is_false_positive BOOLEAN DEFAULT FALSE"))
        conn.commit()
        print("✅ Column 'is_false_positive' added successfully!")

if __name__ == "__main__":
    migrate()
