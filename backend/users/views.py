# Views Users
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from users.permissions import IsAdmin
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_approved=False)  # Definir como não aprovado inicialmente
        return Response(serializer.data)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('Usuário não encontrado!')

        if not user.check_password(password):
            raise AuthenticationFailed('Senha inválida')

        if not user.is_approved:
            raise AuthenticationFailed('Usuário não aprovado ainda')

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        response = Response()
        response.set_cookie(key='jwt', value=access_token, httponly=True)
        response.data = {
            'access': access_token,
            'refresh': str(refresh),
            'role': user.role,
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'is_approved': user.is_approved,
            'created_at': user.created_at,
            'updated_at': user.updated_at,
        }

        return response
    
class ApproveUserView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk=None):
        # Verificar se o usuário está autenticado
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_403_FORBIDDEN)

        user = get_object_or_404(User, pk=pk)
        is_approved = request.data.get('is_approved', None)

        if is_approved is not None:
            user.is_approved = is_approved
            user.save()
            return Response({'status': 'User approval status updated'})
        
        return Response({'detail': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Utiliza JWTAuthentication para validar e obter o usuário a partir do token
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(request.COOKIES.get('jwt'))
            user = jwt_auth.get_user(validated_token)
        except TokenError as e:
            raise AuthenticationFailed('Token inválido ou expirado')

        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAdmin]  # Apenas administradores podem acessar essas rotas

    # Lista de todos os usuários
    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    # Lista apenas usuários aprovados
    def list_approved(self, request):
        queryset = User.objects.filter(is_approved=True)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    # Lista apenas usuários pendentes (não aprovados)
    def list_unapproved(self, request):
        queryset = User.objects.filter(is_approved=False)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
