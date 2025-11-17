CREATE OR REPLACE FUNCTION get_distinct_runs()
RETURNS TABLE (
  run_name TEXT,
  comment TEXT,
  ts TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    distinct_runs.run_name,
    distinct_runs.comment,
    distinct_runs.ts
  FROM (
    SELECT DISTINCT ON (run_name)
      run_logs.run_name,
      run_logs.comment,
      run_logs.ts
    FROM run_logs
    ORDER BY run_name, ts DESC
  ) AS distinct_runs
  ORDER BY distinct_runs.ts DESC;
END;
$$ LANGUAGE plpgsql;
