from azure.storage.blob import BlobServiceClient, ContentSettings
from django.conf import settings

def upload_image_to_azure(file, filename):
    blob_service_client = BlobServiceClient(
        account_url=f"https://{settings.AZURE_ACCOUNT_NAME}.blob.core.windows.net",
        credential=settings.AZURE_ACCOUNT_KEY
    )
    container_client = blob_service_client.get_container_client(settings.AZURE_CONTAINER_NAME)
    blob_client = container_client.get_blob_client(blob=filename)
    
    content_type = file.content_type if hasattr(file, 'content_type') else 'application/octet-stream'
    content_settings = ContentSettings(content_type=content_type)
    
    blob_client.upload_blob(file, overwrite=True, content_settings=content_settings)
    
    return f"https://{settings.AZURE_ACCOUNT_NAME}.blob.core.windows.net/{settings.AZURE_CONTAINER_NAME}/{filename}"
