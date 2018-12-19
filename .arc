@app
begin

@tables
data
  scopeID *String # allows for iam isolated collections
  dataID **String # env:table:key allows for wholesale query of staging/prod tables/keys
  ttl TTL         # if exists expires item from the table
