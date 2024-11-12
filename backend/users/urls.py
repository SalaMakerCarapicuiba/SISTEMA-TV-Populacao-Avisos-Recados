#Urls Users
from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, ApproveUserView, UserViewSet

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('user', UserView.as_view(), name='user_detail'),
    path('approve-user/<uuid:pk>/', ApproveUserView.as_view(), name='approve_user'),
    path('users', UserViewSet.as_view({'get': 'list'}), name='user_list'),
    path('users/<uuid:pk>/', UserViewSet.as_view({'get': 'retrieve', 'patch': 'update', "delete": "destroy"}), name='user_detail'),
    path('users/approved', UserViewSet.as_view({'get': 'list_approved'}), name='user_approved_list'),
    path('users/unapproved', UserViewSet.as_view({'get': 'list_unapproved'}), name='user_unapproved_list'),
]

