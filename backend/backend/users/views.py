# users/views.py - COMPLETE WITH ALL FUNCTIONALITY
from rest_framework import generics, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from .serializers import UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    POST /api/auth/register/ - Anyone can register
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that includes user info (id, username, email, role)
    in the login response for frontend role-based routing.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user details to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,  # Critical for role-based dashboard routing
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login endpoint that returns JWT tokens + user info including role.
    POST /api/auth/login/ - Login and get JWT + user role
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for users.
    GET /api/users/ - List users (admin sees all, users see only themselves)
    POST /api/users/ - Create user (admin only for this endpoint)
    GET /api/users/{id}/ - Get user details
    PATCH /api/users/{id}/ - Update user (including role change)
    DELETE /api/users/{id}/ - Delete user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    
    def get_queryset(self):
        """
        Admins see all users.
        Regular users see only themselves.
        """
        user = self.request.user
        
        # Admins and staff see all users
        if user.role == 1 or user.is_staff:
            return User.objects.all()
        
        # Regular users see only themselves
        return User.objects.filter(id=user.id)
    
    def get_permissions(self):
        """
        Allow authenticated users to access.
        For POST (create), require authentication (admin will create users).
        """
        return [permissions.IsAuthenticated()]
