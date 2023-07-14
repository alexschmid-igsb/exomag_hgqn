#!/bin/bash
psql -c "DROP DATABASE exomag_base_dev"
psql -c "DROP USER exomag_base_dev"
psql -c "DROP DATABASE exomag_base_production"
psql -c "DROP USER exomag_base_production"
psql -c "CREATE USER exomag_base_dev WITH PASSWORD '<DEV PASSWORD>'"
psql -c "CREATE DATABASE exomag_base_dev OWNER exomag_base_dev"
psql -c "GRANT ALL PRIVILEGES ON DATABASE exomag_base_dev TO exomag_base_dev"
psql -c "CREATE USER exomag_base_production WITH PASSWORD '<PRODUCTION PASSWORD>'"
psql -c "CREATE DATABASE exomag_base_production OWNER exomag_base_production"
psql -c "GRANT ALL PRIVILEGES ON DATABASE exomag_base_production TO exomag_base_production"
knex migrate:latest
./run_base_seed.sh