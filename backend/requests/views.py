from rest_framework import viewsets
from .models import JoinRequest
from .serializers import JoinRequestSerializer

class JoinRequestViewSet(viewsets.ModelViewSet):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer