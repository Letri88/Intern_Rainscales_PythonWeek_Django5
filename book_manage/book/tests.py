from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from book.models import Book

class BookAPITests(APITestCase):

    def setUp(self):
        # Create a user
        self.username = "testuser"
        self.password = "testpassword123"
        self.user = User.objects.create_user(username=self.username, password=self.password)
        
        # Create test books
        self.book1 = Book.objects.create(title="Book One", author="Author A", price="9.99", quantity=5)
        self.book2 = Book.objects.create(title="Book Two", author="Author B", price="19.99", quantity=10)

        # Endpoint URLs
        self.token_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh')
        self.logout_url = reverse('logout')
        self.books_list_url = reverse('book-list')
        self.book_detail_url = lambda pk: reverse('book-detail', kwargs={'pk': pk})

    def get_jwt_tokens(self):
        response = self.client.post(self.token_url, {
            'username': self.username,
            'password': self.password
        })
        return response.data['access'], response.data['refresh']

    def test_login_success(self):
        response = self.client.post(self.token_url, {
            'username': self.username,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        response = self.client.post(self.token_url, {
            'username': self.username,
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_blacklist_success(self):
        access_token, refresh_token = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # Perform logout
        response = self.client.post(self.logout_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
        self.assertEqual(response.data['detail'], "Successfully logged out")

        # Verify that the refresh token is indeed blacklisted
        refresh_response = self.client.post(self.token_refresh_url, {'refresh': refresh_token})
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_missing_refresh_token(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        response = self.client.post(self.logout_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Refresh token is required")

    def test_books_list_unauthenticated(self):
        response = self.client.get(self.books_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_books_list_authenticated_with_custom_pagination(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        response = self.client.get(self.books_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify custom pagination structure
        self.assertIn('links', response.data)
        self.assertIn('next', response.data['links'])
        self.assertIn('previous', response.data['links'])
        self.assertIn('count', response.data)
        self.assertIn('total_pages', response.data)
        self.assertIn('current_page', response.data)
        self.assertIn('page_size', response.data)
        self.assertIn('results', response.data)
        
        # Check counts and page values
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['total_pages'], 1)
        self.assertEqual(response.data['current_page'], 1)
        self.assertEqual(len(response.data['results']), 2)

    def test_book_create_authenticated(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        payload = {
            'title': 'New Test Book',
            'author': 'New Author',
            'price': '15.50',
            'quantity': 3
        }
        response = self.client.post(self.books_list_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Test Book')
        self.assertEqual(Book.objects.count(), 3)

    def test_book_detail_authenticated(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        response = self.client.get(self.book_detail_url(self.book1.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.book1.title)

    def test_book_update_authenticated(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        payload = {
            'title': 'Updated Title',
            'author': self.book1.author,
            'price': '12.00',
            'quantity': self.book1.quantity
        }
        response = self.client.put(self.book_detail_url(self.book1.id), payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
        
        self.book1.refresh_from_db()
        self.assertEqual(self.book1.title, 'Updated Title')

    def test_book_delete_authenticated(self):
        access_token, _ = self.get_jwt_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        response = self.client.delete(self.book_detail_url(self.book1.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Book.objects.count(), 1)
