export const getSchemaQuery = `SELECT c.relname AS table_name, 
a.attname AS column_name, 
pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type 
FROM pg_catalog.pg_class c 
JOIN pg_catalog.pg_attribute a 
ON a.attrelid = c.oid 
WHERE c.relkind = 'r' 
AND a.attnum > 0 
AND NOT a.attisdropped 
ORDER BY c.relname, a.attnum;`;
