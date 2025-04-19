from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('login/', views.login_view, name='login'), 
    path('ghi_danh/', views.ghi_danh, name='ghi_danh'),
    path('logout/', views.logout_view, name='logout'),  # Thêm route logout
    path('change-password/', views.change_password, name='change_password'),
    path('quan-ly-hoc-phan/', views.qlihp, name='quan_ly_hoc_phan'), 
    path('history/', views.history, name='history'),
    path('register/', views.register, name='register'),
    path('timing/', views.timing, name='timing'), 
    path('author/', views.author, name='author'),
]