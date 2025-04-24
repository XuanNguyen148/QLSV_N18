from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('login/', views.login_view, name='login'), 
    path('ghi_danh/', views.ghi_danh, name='ghi_danh'),
    path('xoa-hoc-phan/<str:mahp>/', views.xoa_hoc_phan, name='xoa_hoc_phan'),
    path('logout/', views.logout_view, name='logout'),
    path('change-password/', views.change_password, name='change_password'),
    path('quan-ly-hoc-phan/', views.qlihp, name='quan_ly_hoc_phan'), 
    path('history/', views.history, name='history'),
    path('register/', views.dang_ky, name='register'),
    path('timing/', views.timing, name='timing'), 
    path('author/', views.author, name='author'),
    path('them-hoc-phan/<str:mahp>/', views.them_hoc_phan, name='them_hoc_phan'),
    path('api/lophocphan/', views.get_lophocphan, name='get_lophocphan'),
    path('dang-ky-hoc-phan/<str:mahp>/', views.dang_ky_hoc_phan, name='dang_ky_hoc_phan'),
]