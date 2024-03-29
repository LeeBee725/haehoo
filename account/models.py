from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
# Create your models here.

class HaehooUser(AbstractUser):
    #ID : AbstractUSer의 내장 property(username)
    #비밀번호 : AbstractUSer의 내장 property(password)
    nickname = models.CharField(max_length = 10, unique = True, null = False)

    def get_scrap_buckets(self):
        return list(self.buckets.filter(derived_bucket__isnull=False).values_list("derived_bucket_id", flat=True))

    def get_json(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
            "user_scraps": self.get_scrap_buckets()
        }

# class HaehooUserManager(BaseUserManager):

#     def _create_user(self, username, email, password, **extra_fields):
#         """
#         Create and save a user with the given username, email, and password.
#         """
#         if not username:
#             raise ValueError("The given username must be set")
#         email = self.normalize_email(email)
#         # Lookup the real model class from the global app registry so this
#         # manager method can be used in migrations. This is fine because
#         # managers are by definition working on the real model.
#         GlobalUserModel = apps.get_model(
#             self.model._meta.app_label, self.model._meta.object_name
#         )
#         username = GlobalUserModel.normalize_username(username)
#         user = self.model(username=username, email=email, **extra_fields)
#         user.password = make_password(password)
#         user.save(using=self._db)
#         return user

#     def create_user(self, username, email=None, password=None, **extra_fields):
#         extra_fields.setdefault("is_staff", False)
#         extra_fields.setdefault("is_superuser", False)
#         return self._create_user(username, email, password, **extra_fields)

#     def create_superuser(self, username, email=None, password=None, **extra_fields):
#         extra_fields.setdefault("is_staff", True)
#         extra_fields.setdefault("is_superuser", True)

#         if extra_fields.get("is_staff") is not True:
#             raise ValueError("Superuser must have is_staff=True.")
#         if extra_fields.get("is_superuser") is not True:
#             raise ValueError("Superuser must have is_superuser=True.")

#         return self._create_user(username, email, password, **extra_fields)

#     def with_perm(
#         self, perm, is_active=True, include_superusers=True, backend=None, obj=None
#     ):
#         if backend is None:
#             backends = auth._get_backends(return_tuples=True)
#             if len(backends) == 1:
#                 backend, _ = backends[0]
#             else:
#                 raise ValueError(
#                     "You have multiple authentication backends configured and "
#                     "therefore must provide the `backend` argument."
#                 )
#         elif not isinstance(backend, str):
#             raise TypeError(
#                 "backend must be a dotted import path string (got %r)." % backend
#             )
#         else:
#             backend = auth.load_backend(backend)
#         if hasattr(backend, "with_perm"):
#             return backend.with_perm(
#                 perm,
#                 is_active=is_active,
#                 include_superusers=include_superusers,
#                 obj=obj,
#             )
#         return self.none()


# # A few helper functions for common logic between User and AnonymousUser.
# def _user_get_permissions(user, obj, from_name):
#     permissions = set()
#     name = "get_%s_permissions" % from_name
#     for backend in auth.get_backends():
#         if hasattr(backend, name):
#             permissions.update(getattr(backend, name)(user, obj))
#     return permissions
