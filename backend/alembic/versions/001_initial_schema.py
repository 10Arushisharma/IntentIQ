revision="001_initial_schema"
down_revision=None
from alembic import op
import sqlalchemy as sa
def upgrade():
 op.create_table("users",sa.Column("id",sa.String(),primary_key=True),sa.Column("email",sa.String()))
 op.create_table("merchants",sa.Column("id",sa.String(),primary_key=True),sa.Column("name",sa.String()))
 op.create_table("products",sa.Column("id",sa.String(),primary_key=True),sa.Column("merchant_id",sa.String()))
def downgrade():
 op.drop_table("products");op.drop_table("merchants");op.drop_table("users")
