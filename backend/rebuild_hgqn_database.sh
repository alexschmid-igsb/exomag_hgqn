#!/bin/bash
psql -c "DROP DATABASE hgqn_dev"
psql -c "DROP USER hgqn_dev"
psql -c "DROP DATABASE hgqn_production"
psql -c "DROP USER hgqn_production"
psql -c "CREATE USER hgqn_dev WITH PASSWORD '<DEV PASSWORD>'"
psql -c "CREATE DATABASE hgqn_dev OWNER hgqn_dev"
psql -c "GRANT ALL PRIVILEGES ON DATABASE hgqn_dev TO hgqn_dev"
psql -c "CREATE USER hgqn_production WITH PASSWORD '<PRODUCTION PASSWORD>'"
psql -c "CREATE DATABASE hgqn_production OWNER hgqn_production"
psql -c "GRANT ALL PRIVILEGES ON DATABASE hgqn_production TO hgqn_production"
knex migrate:latest
knex seed:run --specific hgqn_seed.js