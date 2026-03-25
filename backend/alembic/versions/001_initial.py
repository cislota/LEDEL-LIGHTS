"""Initial database schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-03-25 13:26:00.000000

"""
from alembic import op
import sqlalchemy as sa


# идентификаторы ревизии, используемые Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Создать таблицу categories
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)

    # Создать таблицу products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('uid', sa.String(), nullable=True),
        sa.Column('recid', sa.String(), nullable=True),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('slug', sa.String(length=500), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('text', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('gallery', sa.Text(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('name_main', sa.String(), nullable=True),
        sa.Column('name_spec', sa.String(), nullable=True),
        sa.Column('article', sa.String(), nullable=True),
        sa.Column('brand', sa.String(), nullable=True),
        sa.Column('specs', sa.Text(), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=True),
        sa.Column('is_visible', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_id'), 'products', ['id'], unique=False)
    op.create_index(op.f('ix_products_uid'), 'products', ['uid'], unique=True)
    op.create_index(op.f('ix_products_slug'), 'products', ['slug'], unique=True)
    op.create_index(op.f('ix_products_title'), 'products', ['title'], unique=False)
    op.create_index(op.f('ix_products_category'), 'products', ['category'], unique=False)

    # Создать таблицу orders
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_number', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('company_name', sa.String(), nullable=True),
        sa.Column('inn', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_orders_id'), 'orders', ['id'], unique=False)
    op.create_index(op.f('ix_orders_order_number'), 'orders', ['order_number'], unique=True)

    # Создать таблицу order_items
    op.create_table(
        'order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('product_name', sa.String(), nullable=False),
        sa.Column('product_uid', sa.String(), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('comment', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_items_id'), 'order_items', ['id'], unique=False)

    # Создать таблицу quiz_results
    op.create_table(
        'quiz_results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('answers', sa.Text(), nullable=False),
        sa.Column('result_type', sa.String(), nullable=True),
        sa.Column('recommended_products', sa.Text(), nullable=True),
        sa.Column('is_processed', sa.Boolean(), nullable=True),
        sa.Column('manager_comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_results_id'), 'quiz_results', ['id'], unique=False)

    # Создать таблицу contact_form_submissions
    op.create_table(
        'contact_form_submissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('subject', sa.String(), nullable=True),
        sa.Column('form_type', sa.String(), nullable=True),
        sa.Column('is_processed', sa.Boolean(), nullable=True),
        sa.Column('manager_comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_form_submissions_id'), 'contact_form_submissions', ['id'], unique=False)

    # Создать таблицу sync_logs
    op.create_table(
        'sync_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sync_type', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('items_processed', sa.Integer(), nullable=True),
        sa.Column('items_created', sa.Integer(), nullable=True),
        sa.Column('items_updated', sa.Integer(), nullable=True),
        sa.Column('items_failed', sa.Integer(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sync_logs_id'), 'sync_logs', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('sync_logs')
    op.drop_table('contact_form_submissions')
    op.drop_table('quiz_results')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('products')
    op.drop_table('categories')
