from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from notices.utils import upload_image_to_azure
from .models import Notice
from .serializers import NoticeSerializer
from rest_framework.decorators import action
from django.utils import timezone
from .serializers import NoticeSerializer
from .filters import NoticeFilter

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated]
    serializer_class = NoticeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NoticeFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        notice_id = kwargs.get('pk')  # Assuming 'pk' is the parameter name for the notice ID

        try:
            instance = self.get_queryset().get(id=notice_id)

            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            image_file = request.FILES.get('image_file')

            if image_file:
                filename = f'{image_file.name}'
                serializer.instance.image_url = upload_image_to_azure(image_file, filename)

            # Update instance fields with request data
            instance.start_date = request.data.get('start_date')
            instance.end_date = request.data.get('end_date')
            instance.start_time = request.data.get('start_time')
            instance.end_time = request.data.get('end_time')
            instance.subject = request.data.get('subject')
            instance.category = request.data.get('category')
            instance.subcategory = request.data.get('subcategory')
            instance.content = request.data.get('content')
            instance.id_user = request.user
            instance.responsible = request.user
            instance.local = request.data.get('local')
            instance.is_approved = True if request.data.get('is_approved') == 'true' else False
            instance.updated_at = timezone.now()
            instance.save()

            return Response(serializer.data)
        except Notice.DoesNotExist:
            return Response({'error': 'Notice not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        queryset = Notice.objects.all()
        notice = get_object_or_404(queryset, pk=pk)
        notice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def approve_notice(self, request, pk=None):
        notice = get_object_or_404(Notice, pk=pk)
        notice.is_approved = request.data['is_approved']
        notice.responsible = request.user
        notice.save()
        return Response({'status': 'Aviso aprovado com sucesso!'})

    def user_notices(self, request):
        notices = Notice.objects.filter(id_user=request.user)
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def approved_notices(self, request):
        notices = Notice.objects.filter(is_approved=True)
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)