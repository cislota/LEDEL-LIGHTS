# CRUD operations for LEDS-LIGHTS backend
from .products import (
    get_product,
    get_product_by_uid,
    get_product_by_slug,
    get_products,
    get_products_count,
    create_product,
    update_product,
    delete_product,
    upsert_product,
    get_categories,
    get_brands,
    get_types,
)

from .categories import (
    get_category,
    get_category_by_slug,
    get_categories,
    get_categories_tree,
    create_category,
    update_category,
    delete_category,
)

from .orders import (
    get_order,
    get_order_by_number,
    get_orders,
    get_orders_count,
    generate_order_number,
    create_order,
    update_order,
    update_order_status,
    cancel_order,
    complete_order,
)

from .quiz_results import (
    get_quiz_result,
    get_quiz_results,
    create_quiz_result,
    mark_quiz_result_processed,
)

from .contact_forms import (
    get_contact_form_submission,
    get_contact_form_submissions,
    create_contact_form_submission,
    mark_contact_form_processed,
)

__all__ = [
    # Products
    "get_product",
    "get_product_by_uid",
    "get_product_by_slug",
    "get_products",
    "get_products_count",
    "create_product",
    "update_product",
    "delete_product",
    "upsert_product",
    "get_categories",
    "get_brands",
    "get_types",
    # Categories
    "get_category",
    "get_category_by_slug",
    "get_categories",
    "get_categories_tree",
    "create_category",
    "update_category",
    "delete_category",
    # Orders
    "get_order",
    "get_order_by_number",
    "get_orders",
    "get_orders_count",
    "generate_order_number",
    "create_order",
    "update_order",
    "update_order_status",
    "cancel_order",
    "complete_order",
    # Quiz Results
    "get_quiz_result",
    "get_quiz_results",
    "create_quiz_result",
    "mark_quiz_result_processed",
    # Contact Forms
    "get_contact_form_submission",
    "get_contact_form_submissions",
    "create_contact_form_submission",
    "mark_contact_form_processed",
]
