#!/bin/bash
psql -c "DROP DATABASE exomag_development_database"
psql -c "DROP USER exomag_development_user"
psql -c "DROP DATABASE exomag_production_database"
psql -c "DROP USER exomag_production_user"
psql -c "CREATE USER exomag_development_user WITH PASSWORD '<DEV PASSWORD>'"
psql -c "CREATE DATABASE exomag_development_database OWNER exomag_development_user"
psql -c "GRANT ALL PRIVILEGES ON DATABASE exomag_development_database TO exomag_development_user"
psql -c "CREATE USER exomag_production_database WITH PASSWORD '<PRODUCTION PASSWORD>'"
psql -c "CREATE DATABASE exomag_production_database OWNER exomag_production_user"
psql -c "GRANT ALL PRIVILEGES ON DATABASE exomag_production_database TO exomag_production_user"
knex migrate:latest
./run_exomag_seed.sh