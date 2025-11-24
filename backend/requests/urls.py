from rest_framework.routers import DefaultRouter
from .views import JoinRequestViewSet

router = DefaultRouter()
router.register(r'join-requests', JoinRequestViewSet)

urlpatterns = router.urls