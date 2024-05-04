from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not username:
            raise ValueError('User must have username!!!')
        
        user = self.model(username=username)
        
        user.set_password(password)  
        user.save()
        
        return user
    
    def create_superuser(self, username, email, password):
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.is_store_manager = True
        user.is_department_manager = True
        
        user.save()
        
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff= models.BooleanField(default=False)
    is_store_manager = models.BooleanField(default=False)
    is_department_manager = models.BooleanField(default=False)


    objects = UserAccountManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]
    
    def __str__(self):
        return self.email
