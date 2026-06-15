# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from book.models import Book
# from .serializers import BookSerializer
# from django.http import Http404
# from rest_framework.permissions import IsAuthenticated
# class BookList(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         book = Book.objects.all()
#         serializer = BookSerializer(book, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = BookSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class BookDetail(APIView):
#     def get_object(self, pk):
#         try: 
#             return Book.objects.get(pk=pk)
#         except Book.DoesNotExist:
#             raise Http404()
    
#     def get(self, request, pk):
#         book = self.get_object(pk)
#         serializer = BookSerializer(book)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         book = self.get_object(pk)
#         serializer = BookSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request, pk):
#         book = self.get_object(pk)
#         book.delete
#         return Response(status=status.HTTP_204_NO_CONTENT)
# from rest_framework import viewsets
# from book.models import Book
# from .serializer import BookSerializer
# from rest_framework.permissions import IsAuthenticated
# class BookViewSet(viewsets.ModelViewSet):
#     queryset = Book.objects.all()
#     permission_classes = [IsAuthenticated]
#     serializer_class = BookSerializer

from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from book.models import Book
from book.books.serializers import BookSerializer
from book.books.pagination import BookPagination

class BookList(APIView):
    def get(self, request):
        books = Book.objects.all()
        title = request.query_params.get('title')
        author = request.query_params.get('author')
        price = request.query_params.get('price')
        quantity = request.query_params.get('quantity')

        if title:
            books = books.filter(title__icontains=title)
        if author:
            books = books.filter(author__icontains=author)
        if price:
            books = books.filter(price=price)
        if quantity:
            books = books.filter(quantity=quantity)

        paginator = BookPagination()
        page = paginator.paginate_queryset(books, request)
        if page is not None:
            serializer = BookSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class BookDetail(APIView):
    def get_object(self,pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            raise Http404()
    def get(self,request,pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    def put(self,request,pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book,data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def patch(self,request,pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book,data = request.data,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk):
        book = self.get_object(pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
# from book.models import Book
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework import viewsets
# from book.books.serializers import BookSerializer
# from book.books.pagination import BookPagination
# from book.books.filters import BookFilter
# from django_filters.rest_framework import DjangoFilterBackend

# class BookViewSet(viewsets.ModelViewSet):
#     queryset = Book.objects.all()
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = BookFilter
#     pagination_class = BookPagination
#     serializer_class = BookSerializer
#     permission_classes = [AllowAny]