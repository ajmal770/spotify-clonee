from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),

    # 👇 CHANGE HERE
    path('signup/', views.signup_view, name='signup'),

    path('signup/step2/', views.signup2_view, name='signup2'),
    path('signup/step3/', views.signup3_view, name='signup3'),
    path('signup/step4/', views.signup4_view, name='signup4'),

    path('home/', views.home, name='home'),
    path('artist/<str:artist_name>/', views.artist_detail, name='artist_detail'),
    path('logout/', views.logout_view, name='logout'),
]
