from django.contrib.auth.models import User
from rest_framework import serializers

from .models import EmployeeProfile


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password"]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user


class EmployeeProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmployeeProfile

        fields = [
            "role",
            "department",
            "designation",
            "phone",
            "profile_picture",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "role",
            "created_at",
            "updated_at",
        ]


class UserProfileSerializer(serializers.ModelSerializer):

    profile = EmployeeProfileSerializer()

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "profile",
        ]

        read_only_fields = [
            "id",
            "username",
            "date_joined",
        ]

    def update(self, instance, validated_data):

        profile_data = validated_data.pop(
            "profile",
            {}
        )

        # Update User fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Update EmployeeProfile
        profile = instance.profile

        for attr, value in profile_data.items():
            setattr(profile, attr, value)

        profile.save()

        return instance

class EmployeeListSerializer(serializers.ModelSerializer):

    role = serializers.CharField(source="profile.role", read_only=True)
    department = serializers.CharField(
        source="profile.department",
        read_only=True
    )
    designation = serializers.CharField(
        source="profile.designation",
        read_only=True
    )
    phone = serializers.CharField(
        source="profile.phone",
        read_only=True
    )

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "department",
            "designation",
            "phone",
            "date_joined",
        ]