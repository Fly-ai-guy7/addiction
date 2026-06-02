"""rbac_and_audit

Revision ID: 20240115_rbac_audit
Revises: 20240115_embeddings
Create Date: 2024-01-15 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20240115_rbac_audit'
down_revision = '20240115_embeddings'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create UserRole Enum type
    user_role = postgresql.ENUM('ADMIN', 'MANAGER', 'USER', name='userrole')
    user_role.create(op.get_bind())

    # Add role column to users
    op.add_column('users', sa.Column('role', sa.Enum('ADMIN', 'MANAGER', 'USER', name='userrole'), nullable=True))
    
    # Create Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('resource_type', sa.String(), nullable=True),
        sa.Column('resource_id', sa.String(), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_column('users', 'role')
    sa.Enum(name='userrole').drop(op.get_bind())
