from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from useful_links_saver import views


router = routers.DefaultRouter()
router.register(r'links', views.LinkView, 'links')
router.register(r'groups_links', views.GroupLinksView, 'groups')

urlpatterns = [
    path('admin/', admin.site.urls),         
    path('api/', include(router.urls))
]