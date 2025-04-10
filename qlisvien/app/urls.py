from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('login/', views.login_view, name='login'), 
    path('ghi_danh/', views.ghi_danh, name='ghi_danh'),
    path('logout/', views.logout_view, name='logout'),  # Thêm route logout
    path('change-password/', views.change_password, name='change_password'),
]