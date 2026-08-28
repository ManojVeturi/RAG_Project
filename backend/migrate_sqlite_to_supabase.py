from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.models import (
    Company,
    User,
    Document,
    Conversation,
    Ticket,
)


# ============================================================
# DATABASE CONNECTIONS
# ============================================================

sqlite_engine = create_engine(
    "sqlite:///./ai_enterprise.db"
)

postgres_engine = create_engine(
    settings.database_url
)

PostgresSession = sessionmaker(
    bind=postgres_engine,
    autocommit=False,
    autoflush=False,
)


COMPANY_ID = 1


def migrate():
    postgres_db = PostgresSession()

    try:
        # ====================================================
        # Verify company
        # ====================================================

        company = (
            postgres_db.query(Company)
            .filter(Company.id == COMPANY_ID)
            .first()
        )

        if company is None:
            raise RuntimeError(
                f"Company with id={COMPANY_ID} "
                "does not exist in Supabase."
            )

        print(
            f"Using company: "
            f"{company.name} "
            f"(id={company.id})"
        )

        # ====================================================
        # READ OLD SQLITE DATABASE
        # ====================================================

        with sqlite_engine.connect() as sqlite_db:

            users = sqlite_db.execute(
                text("""
                    SELECT
                        id,
                        name,
                        email,
                        password_hash,
                        role,
                        created_at
                    FROM users
                    ORDER BY id
                """)
            ).mappings().all()

            documents = sqlite_db.execute(
                text("""
                    SELECT
                        id,
                        filename,
                        file_type,
                        file_path,
                        uploaded_by,
                        status,
                        created_at
                    FROM documents
                    ORDER BY id
                """)
            ).mappings().all()

            conversations = sqlite_db.execute(
                text("""
                    SELECT
                        id,
                        user_id,
                        question,
                        answer,
                        created_at
                    FROM conversations
                    ORDER BY id
                """)
            ).mappings().all()

            tickets = sqlite_db.execute(
                text("""
                    SELECT
                        id,
                        user_id,
                        title,
                        description,
                        category,
                        priority,
                        status,
                        ai_summary,
                        created_at,
                        updated_at
                    FROM tickets
                    ORDER BY id
                """)
            ).mappings().all()

        # ====================================================
        # DISPLAY SOURCE DATA
        # ====================================================

        print()
        print("SQLite records found:")
        print(f"Users:          {len(users)}")
        print(f"Documents:      {len(documents)}")
        print(f"Conversations:  {len(conversations)}")
        print(f"Tickets:        {len(tickets)}")

        # ====================================================
        # USERS
        # ====================================================

        print()
        print("Migrating users...")

        for row in users:

            existing_user = (
                postgres_db.query(User)
                .filter(User.email == row["email"])
                .first()
            )

            if existing_user:
                print(
                    f"Skipping existing user: "
                    f"{row['email']}"
                )
                continue

            user = User(
                id=row["id"],
                company_id=COMPANY_ID,
                name=row["name"],
                email=row["email"],
                password_hash=row["password_hash"],
                role=row["role"],
                created_at=row["created_at"],
            )

            postgres_db.add(user)

        postgres_db.flush()

        print(
            f"Processed {len(users)} users."
        )

        # ====================================================
        # DOCUMENTS
        # ====================================================

        print()
        print("Migrating documents...")

        for row in documents:

            existing_document = (
                postgres_db.query(Document)
                .filter(
                    Document.id == row["id"]
                )
                .first()
            )

            if existing_document:
                print(
                    f"Skipping existing document: "
                    f"{row['filename']}"
                )
                continue

            uploader = (
                postgres_db.query(User)
                .filter(
                    User.id == row["uploaded_by"]
                )
                .first()
            )

            if uploader is None:
                print(
                    f"Skipping document "
                    f"{row['filename']}: "
                    f"user {row['uploaded_by']} "
                    "does not exist."
                )
                continue

            document = Document(
                id=row["id"],
                company_id=COMPANY_ID,
                filename=row["filename"],
                file_type=row["file_type"],
                file_path=row["file_path"],
                uploaded_by=row["uploaded_by"],
                status=row["status"],
                created_at=row["created_at"],
            )

            postgres_db.add(document)

        postgres_db.flush()

        print(
            f"Processed {len(documents)} documents."
        )

        # ====================================================
        # CONVERSATIONS
        # ====================================================

        print()
        print("Migrating conversations...")

        for row in conversations:

            existing_conversation = (
                postgres_db.query(Conversation)
                .filter(
                    Conversation.id == row["id"]
                )
                .first()
            )

            if existing_conversation:
                print(
                    f"Skipping conversation "
                    f"{row['id']}"
                )
                continue

            user = (
                postgres_db.query(User)
                .filter(
                    User.id == row["user_id"]
                )
                .first()
            )

            if user is None:
                print(
                    f"Skipping conversation "
                    f"{row['id']}: "
                    f"user {row['user_id']} "
                    "does not exist."
                )
                continue

            conversation = Conversation(
                id=row["id"],
                company_id=COMPANY_ID,
                user_id=row["user_id"],
                question=row["question"],
                answer=row["answer"],
                created_at=row["created_at"],
            )

            postgres_db.add(conversation)

        postgres_db.flush()

        print(
            f"Processed "
            f"{len(conversations)} conversations."
        )

        # ====================================================
        # TICKETS
        # ====================================================

        print()
        print("Migrating tickets...")

        for row in tickets:

            existing_ticket = (
                postgres_db.query(Ticket)
                .filter(
                    Ticket.id == row["id"]
                )
                .first()
            )

            if existing_ticket:
                print(
                    f"Skipping ticket "
                    f"{row['id']}"
                )
                continue

            user = (
                postgres_db.query(User)
                .filter(
                    User.id == row["user_id"]
                )
                .first()
            )

            if user is None:
                print(
                    f"Skipping ticket "
                    f"{row['id']}: "
                    f"user {row['user_id']} "
                    "does not exist."
                )
                continue

            ticket = Ticket(
                id=row["id"],
                company_id=COMPANY_ID,
                user_id=row["user_id"],
                title=row["title"],
                description=row["description"],
                category=row["category"],
                priority=row["priority"],
                status=row["status"],
                ai_summary=row["ai_summary"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
            )

            postgres_db.add(ticket)

        postgres_db.flush()

        print(
            f"Processed {len(tickets)} tickets."
        )

        # ====================================================
        # COMMIT
        # ====================================================

        postgres_db.commit()

        print()
        print("=" * 60)
        print("✅ MIGRATION COMPLETED SUCCESSFULLY")
        print("=" * 60)

    except Exception:
        postgres_db.rollback()

        print()
        print("❌ Migration failed.")
        print("Transaction rolled back.")

        raise

    finally:
        postgres_db.close()


if __name__ == "__main__":
    migrate()