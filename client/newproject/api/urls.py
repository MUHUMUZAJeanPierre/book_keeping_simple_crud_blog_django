from .views import get_books, create_book, book_detail
from django.urls import path

urlpatterns = [
    path('books/', get_books, name='get_books'),
    path('books/create/', create_book, name='create_book'),
    path('books/<int:pk>', book_detail, name='book_detail')
]