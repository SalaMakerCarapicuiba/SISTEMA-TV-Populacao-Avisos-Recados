from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Notice
        fields = ['id', 'start_date', 'end_date', 'start_time', 'end_time', 'subject', 
                  'category', 'subcategory', 'content', 'id_user', 'responsible' , 'user_name',
                  'local', 'is_approved', 'image_url', 'image_file']

    def create(self, validated_data):
        image_file = validated_data.pop('image_file', None)
        notice = Notice.objects.create(**validated_data)
        if image_file:
            notice.save(image_file=image_file)
        return notice

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image_file:
            instance.save(image_file=image_file)
        return instance
