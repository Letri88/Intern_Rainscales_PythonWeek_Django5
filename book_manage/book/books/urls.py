# from django.urls import path
# from book.books.view import BookViewSet
# book_list = BookViewSet.as_view({
#     'get': 'list',
#     'post': 'create'
# })
# book_detail = BookViewSet.as_view({
#     'get': 'retrieve',
#     'put': 'update',
#     'patch': 'partial_update',
#     'delete': 'destroy'
# })
# urlpatterns = [
#     path('books/', book_list),
#     path('books/<int:pk>/', book_detail)
# ]
# from rest_framework.routers import DefaultRouter
# from .view import BookViewSet

# router = DefaultRouter()
# router.register(r'books', BookViewSet)

# urlpatterns = router.urls
from django.urls import path
from book.books.view import BookList, BookDetail

urlpatterns = [
    path('books/', BookList.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetail.as_view(), name='book-detail'),
]