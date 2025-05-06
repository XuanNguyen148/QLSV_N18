from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('login/', views.login_view, name='login'), 
    path('ghi_danh/', views.ghi_danh, name='ghi_danh'),
    path('logout/', views.logout_view, name='logout'),
    path('change-password/', views.change_password, name='change_password'),
    path('quan_ly_hoc_phan/', views.qlihp, name='quan_ly_hoc_phan'), 
    path('history/', views.history, name='history'),
    path('register/', views.dang_ky, name='register'),
    path('timing/', views.timing, name='timing'), 
    path('author/', views.author, name='author'),
    path('update_role/', views.update_role, name='update_role'),
    path('get_lophocphan/', views.get_lophocphan, name='get_lophocphan'),
]