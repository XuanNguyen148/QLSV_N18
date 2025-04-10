from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'), 
    path('login/', views.login_view, name='login'),  # Thay đổi từ LoginView sang login_view
    path('students/', views.student_list, name='student_list'),
    path('logout/', views.logout_view, name='logout'),  # Thêm route logout
]