from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.models.core import Document, Embedding, Project
from typing import List, Optional
import shutil
import os
import uuid

router = APIRouter()

# Determine upload directory based on environment
# In Docker, we might still want /app/uploads, but for local tests, we need a writable path.
# Using a relative path works for both if the working directory is set correctly.
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    project_id: int = Form(...),
    db: AsyncSession = Depends(deps.get_db),
    # current_user: dict = Depends(deps.get_current_active_user)
):
    # 1. Save File
    file_id = str(uuid.uuid4())
    file_ext = file.filename.split(".")[-1]
    file_path = f"{UPLOAD_DIR}/{file_id}.{file_ext}"
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # 2. Create Document Record
    doc = Document(
        project_id=project_id, 
        filename=file.filename, 
        file_path=file_path,
        status="processing"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # 3. Trigger Background Processing (Sync for MVP, Async for Prod)
    # For MVP, we'll process inline to show immediate effect
    await process_document_inline(doc.id, file_path, db)

    return {"status": "success", "document_id": doc.id, "filename": file.filename}

async def process_document_inline(doc_id: int, file_path: str, db: AsyncSession):
    from litellm import embedding as get_embedding
    
    # Simple Text Extraction (Mocking PDF/Docx support for speed)
    # Ideally use Unstructured or PyPDF2
    text_content = ""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text_content = f.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return

    # Simple Chunking
    chunk_size = 1000
    chunks = [text_content[i:i+chunk_size] for i in range(0, len(text_content), chunk_size)]

    # Embed and Store
    for idx, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
            
        try:
            # Mock embedding if no key (to prevent crash in demo)
            # response = get_embedding(model="text-embedding-3-small", input=[chunk])
            # vector = response['data'][0]['embedding']
            
            # Using random vector for MVP without API Key, 
            # In production, uncomment above and ensure OPENAI_API_KEY is set
            import random
            vector = [random.random() for _ in range(1536)] 

            emb = Embedding(
                document_id=doc_id,
                content=chunk,
                embedding=vector,
                chunk_index=idx
            )
            db.add(emb)
        except Exception as e:
            print(f"Error embedding chunk {idx}: {e}")
    
    # Update Doc Status
    doc = await db.get(Document, doc_id)
    doc.status = "completed"
    await db.commit()
