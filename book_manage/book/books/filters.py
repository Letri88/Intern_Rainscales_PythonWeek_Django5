import django_filters

from book.models import Book


class BookFilter(django_filters.FilterSet):

    title = django_filters.CharFilter(
        field_name='title',
        lookup_expr='icontains'
    )

    author = django_filters.CharFilter(
        field_name='author',
        lookup_expr='icontains'
    )

    price_min = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    price_max = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    quantity_min = django_filters.NumberFilter(
        field_name='quantity',
        lookup_expr='gte'
    )

    quantity_max = django_filters.NumberFilter(
        field_name='quantity',
        lookup_expr='lte'
    )

    class Meta:
        model = Book

        fields = [
            'title',
            'author',
            'price_min',
            'price_max',
            'quantity_min',
            'quantity_max',
        ]