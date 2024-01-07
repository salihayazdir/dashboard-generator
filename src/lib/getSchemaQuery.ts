export const getSchemaQuery = `
SELECT 
    c.relname AS table_name, 
    a.attname AS column_name, 
    pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
    (EXISTS (
        SELECT 1
        FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel
            ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_attribute attr
            ON attr.attnum = ANY(con.conkey)
        WHERE con.contype = 'p' 
            AND con.conrelid = c.oid
            AND attr.attnum = a.attnum
    )) AS is_primary_key,
    (EXISTS (
        SELECT 1
        FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel
            ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_attribute attr
            ON attr.attnum = ANY(con.conkey)
        WHERE con.contype = 'f' 
            AND con.conrelid = c.oid
            AND attr.attnum = a.attnum
    )) AS is_referencing,
    (
        SELECT cl.relname
        FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel
            ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_class cl
            ON cl.oid = con.confrelid
        INNER JOIN pg_catalog.pg_attribute attr
            ON attr.attnum = ANY(con.conkey)
        WHERE con.contype = 'f' 
            AND con.conrelid = c.oid
            AND attr.attnum = a.attnum
        LIMIT 1
    ) AS foreign_table_name
FROM pg_catalog.pg_class c 
JOIN pg_catalog.pg_attribute a 
    ON a.attrelid = c.oid 
WHERE c.relkind = 'r' 
    AND a.attnum > 0 
    AND NOT a.attisdropped 
ORDER BY c.relname, a.attnum;
`;
