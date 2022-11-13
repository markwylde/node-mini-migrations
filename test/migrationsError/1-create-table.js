export function up (db) {
  return db.run('CREATE_WHOOPS TABLE test_table (test TEXT)');
}

export function down (db) {
  return db.run('DROP TABLE test_table');
}
