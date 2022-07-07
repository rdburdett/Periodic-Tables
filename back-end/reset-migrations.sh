# reset-migrations.sh
#!/bin/bash

# Development database reset
npx knex migrate:rollback --env development
npx knex migrate:latest --env development
npx knex seed:run --env development

# Preview database reset
npx knex migrate:rollback --env preview
npx knex migrate:latest --env preview
npx knex seed:run --env preview

# Production database reset
npx knex migrate:rollback --env production
npx knex migrate:latest --env production
npx knex seed:run --env production

# Test database reset
npx knex migrate:rollback --env test
npx knex migrate:latest --env test
npx knex seed:run --env test