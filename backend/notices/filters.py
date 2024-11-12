import django_filters
from .models import Notice

class NoticeFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='start_date', lookup_expr='exact')
    end_date = django_filters.DateFilter(field_name='end_date', lookup_expr='exact')
    start_time = django_filters.TimeFilter(field_name='start_time', lookup_expr='exact')
    end_time = django_filters.TimeFilter(field_name='end_time', lookup_expr='exact')
    subject = django_filters.CharFilter(field_name='subject', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category', lookup_expr='icontains')
    subcategory = django_filters.CharFilter(field_name='subcategory', lookup_expr='icontains')
    content = django_filters.CharFilter(field_name='content', lookup_expr='icontains')
    id_user = django_filters.UUIDFilter(field_name='id_user__id', lookup_expr='exact')
    responsible = django_filters.UUIDFilter(field_name='responsible__id', lookup_expr='exact')
    local = django_filters.CharFilter(field_name='local', lookup_expr='icontains')
    is_approved = django_filters.BooleanFilter(field_name='is_approved')
    user_name = django_filters.CharFilter(field_name='user_name', lookup_expr='icontains')
    share_morning = django_filters.BooleanFilter(field_name='share_morging')
    share_afternoon = django_filters.BooleanFilter(field_name='share_afternoon')
    share_evening = django_filters.BooleanFilter(field_name='share_evening')
    interest_area = django_filters.CharFilter(field_name='interest_area', lookup_expr='icontains')

    class Meta:
        model = Notice
        fields = ['start_date', 'end_date', 'start_time', 'end_time', 'subject', 'category', 
                  'subcategory', 'content', 'id_user', 'responsible', 'local', 'is_approved',
                  'user_name', 'share_morning', 'share_afternoon', 'share_evening', 'interest_area']
