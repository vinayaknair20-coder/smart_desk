# users/serializers.py - COMPLETE WITH ROLE UPDATE SUPPORT
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Allows creating users with password and updating roles.
    """
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "password"]
        read_only_fields = ["id"]  # FIXED: Removed "role" so it can be updated

    def create(self, validated_data):
        """Create new user with hashed password."""
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Update user fields including role.
        Password updates are optional and hashed properly.
        """
        # Update basic fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.role = validated_data.get('role', instance.role)  # CRITICAL: Allow role updates
        
        # Only update password if provided
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.save()
        return instance
