defmodule Models.Repo.Migrations.AddLatestSnapshotStatisticsView do
  use Ecto.Migration

  def up do
    # View
    execute """
      /* Create Materialized View */
      CREATE MATERIALIZED VIEW latest_snapshot_statistics
      AS SELECT id, gamer_tag_id, is_competitive, inserted_at, updated_at
      FROM (SELECT id, gamer_tag_id, is_competitive, inserted_at, updated_at, dense_rank()
            OVER (PARTITION BY gamer_tag_id
                  ORDER BY updated_at desc)
            AS rank FROM snapshot_statistics)
      x WHERE rank <= 2;
    """

    execute """
      /* Create Refresh Function */
      CREATE OR REPLACE FUNCTION refresh_latest_snapshots()
      RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW latest_snapshot_statistics;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    """

    execute """
      /* Create Refresh Trigger */
      CREATE TRIGGER refresh_latest_snapshots_trg
      AFTER INSERT
      ON snapshot_statistics
      FOR EACH STATEMENT
      EXECUTE PROCEDURE refresh_latest_snapshots();
    """
  end

  def down do
    execute """
      /* Drop Refresh Trigger */
      DROP TRIGGER refresh_latest_snapshots_trg
      ON snapshot_statistics;
    """

    execute """
      /* Drop Refresh Function */
      DROP FUNCTION refresh_latest_snapshots();
    """

    execute """
      /* Drop Materialized View */
      DROP MATERIALIZED VIEW latest_snapshot_statistics;
    """
  end
end
