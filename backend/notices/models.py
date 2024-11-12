from django.db import models
from notices.utils import upload_image_to_azure
from users.models import User
from django.utils import timezone
import uuid

class Notice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    subject = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    content = models.TextField()
    id_user = models.ForeignKey(User, related_name='user_notices', on_delete=models.DO_NOTHING)
    responsible = models.ForeignKey(User, related_name='responsible_notices', on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    local = models.CharField(max_length=100)
    is_approved = models.BooleanField(default=False)
    user_name = models.CharField(max_length=150, blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True) 
    share_morning = models.BooleanField(default=False)
    share_afternoon = models.BooleanField(default=False)
    share_evening = models.BooleanField(default=False)
    interest_area = models.CharField(max_length=100)
    
    def save(self, *args, **kwargs):
        image_file = kwargs.pop('image_file', None)

        if image_file:
            filename = f'{image_file.name}'  
            self.image_url = upload_image_to_azure(image_file, filename) 

        if self.id_user:
            self.user_name = self.id_user.full_name
            
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'posts'
        managed = True

    def __str__(self):
        return self.subject
