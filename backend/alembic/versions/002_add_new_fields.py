"""Add new fields and order status enum

Revision ID: 002_add_new_fields
Revises: 001_initial
Create Date: 2026-04-03 00:00:00.000000

Добавляет:
- products: tilda_id, last_synced_at, stock, новые индексы
- orders: статусы через ENUM, total_amount, currency, delivery_address,
          manager_comment, manager_id, status_changed_at, новые индексы
- order_items: product_sku, subtotal, created_at, FK каскады
"""
from alembic import op
import sqlalchemy as sa

revision = '002_add_new_fields'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # === ENUM для статусов заказов ===
    # Создаём ENUM тип в PostgreSQL
    order_status_enum = sa.Enum(
        'processing', 'confirmed', 'cancelled', 'completed', 'shipped',
        name='orderstatus'
    )
    order_status_enum.create(op.get_bind(), checkfirst=True)

    # === Добавляем новые колонки в products ===
    op.add_column('products', sa.Column('tilda_id', sa.String(), nullable=True))
    op.add_column('products', sa.Column('last_synced_at', sa.DateTime(), nullable=True))
    op.add_column('products', sa.Column('stock', sa.Integer(), server_default='0', nullable=False))

    # Индексы для products
    op.create_index('ix_products_category_type', 'products', ['category', 'type'])
    op.create_index('ix_products_price', 'products', ['price'])
    op.create_index('ix_products_is_available', 'products', ['is_available'])
    op.create_index('ix_products_tilda_id', 'products', ['tilda_id'], unique=True)

    # === Обновляем order_items: каскадные FK и новые колонки ===
    op.add_column('order_items', sa.Column('product_sku', sa.String(), nullable=True))
    op.add_column('order_items', sa.Column('subtotal', sa.Float(), nullable=True))
    op.add_column('order_items', sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()))

    # Пересоздаём FK с каскадным удалением
    # Сначала удаляем старые FK
    op.drop_constraint('order_items_order_id_fkey', 'order_items', type_='foreignkey')
    op.drop_constraint('order_items_product_id_fkey', 'order_items', type_='foreignkey')

    # Создаём новые FK с каскадами
    op.create_foreign_key(
        'fk_order_items_order_id', 'order_items', 'orders',
        ['order_id'], ['id'], ondelete='CASCADE'
    )
    op.create_foreign_key(
        'fk_order_items_product_id', 'order_items', 'products',
        ['product_id'], ['id'], ondelete='SET NULL'
    )

    # Индексы для order_items
    op.create_index('ix_order_items_product', 'order_items', ['product_id', 'order_id'])

    # === Добавляем новые колонки в orders ===
    op.add_column('orders', sa.Column('delivery_address', sa.Text(), nullable=True))
    op.add_column('orders', sa.Column('total_amount', sa.Float(), nullable=True))
    op.add_column('orders', sa.Column('currency', sa.String(), server_default='RUB', nullable=False))
    op.add_column('orders', sa.Column('manager_comment', sa.Text(), nullable=True))
    op.add_column('orders', sa.Column('manager_id', sa.Integer(), nullable=True))
    op.add_column('orders', sa.Column('status_changed_at', sa.DateTime(), nullable=True))

    # Конвертируем текстовое поле status в ENUM
    # Сначала обновляем пустые/неверные значения
    op.execute(
        "UPDATE orders SET status = 'processing' WHERE status IS NULL OR status = ''"
    )
    op.execute(
        "UPDATE orders SET status = 'processing' WHERE status NOT IN ('processing', 'confirmed', 'cancelled', 'completed', 'shipped')"
    )
    # Преобразуем колонку в ENUM тип
    op.alter_column(
        'orders', 'status',
        type_=order_status_enum,
        existing_type=sa.String(),
        postgresql_using='status::orderstatus'
    )

    # Индексы для orders
    op.create_index('ix_orders_status_created', 'orders', ['status', 'created_at'])
    op.create_index('ix_orders_source', 'orders', ['source'])
    op.create_index('ix_orders_name', 'orders', ['name'])
    op.create_index('ix_orders_phone', 'orders', ['phone'])
    op.create_index('ix_orders_email', 'orders', ['email'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])

    # === Добавляем индексы в sync_logs ===
    op.create_index('ix_sync_logs_type_started', 'sync_logs', ['sync_type', 'started_at'])

    # === Добавляем индексы в quiz_results ===
    op.create_index('ix_quiz_results_name', 'quiz_results', ['name'])
    op.create_index('ix_quiz_results_phone', 'quiz_results', ['phone'])
    op.create_index('ix_quiz_results_is_processed', 'quiz_results', ['is_processed'])
    op.create_index('ix_quiz_results_created_at', 'quiz_results', ['created_at'])

    # === Добавляем индексы в contact_form_submissions ===
    op.create_index('ix_contact_submissions_name', 'contact_form_submissions', ['name'])
    op.create_index('ix_contact_submissions_is_processed', 'contact_form_submissions', ['is_processed'])
    op.create_index('ix_contact_submissions_created_at', 'contact_form_submissions', ['created_at'])

    # === Добавляем индексы в categories ===
    op.create_index('ix_categories_parent', 'categories', ['parent_id'])


def downgrade() -> None:
    # === Удаляем индексы ===
    op.drop_index('ix_categories_parent', 'categories')
    op.drop_index('ix_contact_submissions_name', 'contact_form_submissions')
    op.drop_index('ix_contact_submissions_is_processed', 'contact_form_submissions')
    op.drop_index('ix_contact_submissions_created_at', 'contact_form_submissions')
    op.drop_index('ix_quiz_results_name', 'quiz_results')
    op.drop_index('ix_quiz_results_phone', 'quiz_results')
    op.drop_index('ix_quiz_results_is_processed', 'quiz_results')
    op.drop_index('ix_quiz_results_created_at', 'quiz_results')
    op.drop_index('ix_sync_logs_type_started', 'sync_logs')
    op.drop_index('ix_orders_status_created', 'orders')
    op.drop_index('ix_orders_source', 'orders')
    op.drop_index('ix_orders_name', 'orders')
    op.drop_index('ix_orders_phone', 'orders')
    op.drop_index('ix_orders_email', 'orders')
    op.drop_index('ix_orders_created_at', 'orders')
    op.drop_index('ix_order_items_product', 'order_items')
    op.drop_index('ix_products_category_type', 'products')
    op.drop_index('ix_products_price', 'products')
    op.drop_index('ix_products_is_available', 'products')
    op.drop_index('ix_products_tilda_id', 'products')

    # === Возвращаем orders.status к строке ===
    op.alter_column(
        'orders', 'status',
        type_=sa.String(),
        existing_type=sa.Enum('processing', 'confirmed', 'cancelled', 'completed', 'shipped', name='orderstatus'),
        postgresql_using='status::text'
    )

    # === Удаляем новые колонки orders ===
    op.drop_column('orders', 'delivery_address')
    op.drop_column('orders', 'total_amount')
    op.drop_column('orders', 'currency')
    op.drop_column('orders', 'manager_comment')
    op.drop_column('orders', 'manager_id')
    op.drop_column('orders', 'status_changed_at')

    # === Восстанавливаем старые FK в order_items ===
    op.drop_constraint('fk_order_items_order_id', 'order_items', type_='foreignkey')
    op.drop_constraint('fk_order_items_product_id', 'order_items', type_='foreignkey')
    op.create_foreign_key('order_items_order_id_fkey', 'order_items', 'orders', ['order_id'], ['id'])
    op.create_foreign_key('order_items_product_id_fkey', 'order_items', 'products', ['product_id'], ['id'])

    # === Удаляем новые колонки order_items ===
    op.drop_column('order_items', 'product_sku')
    op.drop_column('order_items', 'subtotal')
    op.drop_column('order_items', 'created_at')

    # === Удаляем новые колонки products ===
    op.drop_column('products', 'tilda_id')
    op.drop_column('products', 'last_synced_at')
    op.drop_column('products', 'stock')

    # === Удаляем ENUM ===
    sa.Enum(name='orderstatus').drop(op.get_bind(), checkfirst=True)
